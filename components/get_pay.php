<?php
// платеж с мани пришел
// скрипт обновляет оплату (в таблице payment) и создает/обновляет поле с днями (в таблице subscription) и отправляет сообщение об оплате

header('Content-Type: application/json; charset=utf-8');

require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd.php");



if(1===1)
{
	$secret = 'bfpLkrbKvuwpaNMiuzIX34jN'; // секрет, который мы получили в первом шаге от яндекс.
	// получение данных.
	$xdc = array(
		'notification_type' => $_POST['notification_type'], // p2p-incoming / card-incoming - с кошелька / с карты
		'operation_id'      => $_POST['operation_id'],      // Идентификатор операции в истории счета получателя.
		'amount'            => $_POST['amount'],            // Сумма, которая зачислена на счет получателя.
		'withdraw_amount'   => $_POST['withdraw_amount'],   // Сумма, которая списана со счета отправителя.
		'currency'          => $_POST['currency'],            // Код валюты — всегда 643 (рубль РФ согласно ISO 4217).
		'datetime'          => $_POST['datetime'],          // Дата и время совершения перевода.
		'sender'            => $_POST['sender'],            // Для переводов из кошелька — номер счета отправителя. Для переводов с произвольной карты — параметр содержит пустую строку.
		'codepro'           => $_POST['codepro'],           // Для переводов из кошелька — перевод защищен кодом протекции. Для переводов с произвольной карты — всегда false.
		'label'             => $_POST['label'],             // Метка платежа. Если ее нет, параметр содержит пустую строку.
		'sha1_hash'         => $_POST['sha1_hash']          // SHA-1 hash параметров уведомления.
	);

	// проверка хеш
	if (sha1($xdc['notification_type'].'&'.
			 $xdc['operation_id'].'&'.
			 $xdc['amount'].'&'.
			 $xdc['currency'].'&'.
			 $xdc['datetime'].'&'.
			 $xdc['sender'].'&'.
			 $xdc['codepro'].'&'.
			 $secret.'&'.
			 $xdc['label']) != $xdc['sha1_hash']) 
			 {
		exit; // останавливаем скрипт. у вас тут может быть свой код. exit('Верификация не пройдена. SHA1_HASH не совпадает.');
	}	
}

$label = $xdc['label'];
$amount = $xdc['withdraw_amount'];

//if($amount != '1450.00'){exit;}		// сумма не равна нужной


//$label = 'id=3&token=db7722b86649cb0f4e23ed8112b3d092';
//$amount = 160;


// парсим строку на значения
parse_str($label, $str);
$paymentId = $str['id'];
$user_token = $str['token'];


$data = [];
$data['result'] = false;
	
$update = upPayment($db, $paymentId, $user_token, $amount);

if($update)
{
	$user = getUser($db, $user_token);
	if($user) 
	{
		$data['result'] = true;
		$data['paymentId'] = $paymentId;
		$data['token'] = $user_token;
		$data['userId'] = $user['id'];
		$data['mail'] = $user['mail'];	

		$sub = setSubscription($db, $user['id'], $amount);
		
		if($sub['result'])
		{
			$data['sub'] = $sub['sub'];
			$data['amount'] = $sub['amount'];
			$data['days'] = $sub['days'];
		}
		
		sendMess($user['mail'], $amount);		
	}
}

echo json_encode( $data );



// обновляем оплату в таблице Payment 
function upPayment($db, $paymentId, $user_token, $amount)
{
	$sql = "UPDATE payment SET buy = '1', amount = :amount WHERE id = :id AND user_token = :user_token LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':id', $paymentId, PDO::PARAM_INT);
	$r->bindValue(':user_token', $user_token, PDO::PARAM_STR);
	$r->bindValue(':amount', $amount, PDO::PARAM_INT);
	$r->execute();

	return $r->rowCount() ? true : false;
}


// находим id, e-mail
function getUser($db, $user_token)
{
	$sql = "SELECT id, mail FROM user WHERE token = :token LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':token', $user_token);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);
	
	return $res;
}

// после оплаты создаем подписку или обновляем (если уже существует)
function setSubscription($db, $user_id, $amount)
{
	$data = [];
	$data['result'] = false;
	
	$sql = "SELECT * FROM subscription WHERE user_id = :user_id LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':user_id', $user_id, PDO::PARAM_INT);
	$r->execute();
	$res = $r->fetch(PDO::FETCH_ASSOC);
	
	$days = calcDays($amount);
	
	if($res)	// подписка уже есть в базе, обновляем данные
	{
		$days += (float)$res['days'];
		
		$res2 = upNoteSubscription($db, $res['id'], $days);
		
		if($res2 && $res2['result'])
		{
			$data['result'] = true;
			$data['sub'] = 'update';
			$data['amount'] = $amount;
			$data['days'] = $days;
		}				
	}
	else	// подписки нету, создаем новую
	{
		$res2 = addNoteSubscription($db, $user_id, $days);
		
		if($res2 && $res2['result'])
		{
			$data['result'] = true;
			$data['sub'] = 'new';
			$data['amount'] = $amount;
			$data['days'] = $days;
		}		
	}
	
	return $data;
}


// подсчитываем кол-во оплаченных дней и отдаем результат
function calcDays($amount)
{
	$priceDay = 2;		// цена подписки за день
	
	$days = (float)$amount / $priceDay;
	
	return round($days, 0, PHP_ROUND_HALF_UP);
}


// обновляем в подписке кол-во дней
function upNoteSubscription($db, $id, $days)
{
	$data = [];
	$data['result'] = false;

	$sql = "UPDATE subscription SET days = :days WHERE id = :id LIMIT 1";
	$r = $db->prepare($sql);
	$r->bindValue(':id', $id, PDO::PARAM_INT);
	$r->bindValue(':days', $days, PDO::PARAM_INT);
	$r->execute();
	
	if($r->rowCount())
	{
		$data['result'] = true;
		$data['id'] = $id;
	}	
	
	return $data;
}


// создаем новую подписку
function addNoteSubscription($db, $user_id, $days)
{
	$data = [];
	$data['result'] = false;
	
	$sql = "INSERT INTO subscription (user_id, days) VALUES (:user_id, :days)";
	$r = $db->prepare($sql);
	$r->bindValue(':user_id', $user_id);
	$r->bindValue(':days', $days);
	$r->execute();

	if($r->rowCount())
	{
		$data['result'] = true;
		$data['id'] = $db->lastInsertId();
	}

	return $data;
}


// отправляем сообщение об оплате 
function sendMess($mail, $amount)
{
	$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@engineering-plan.ru";

	$arrayTo = array($mail.', engineering-plan@mail.ru');
	$email = implode(",", $arrayTo);

	//$email = $res['mail'];
	$tema = "Покупка программы-конструктор «Инженерный план»";
	$mess = 'Здравствуйте.<br>Вы оформили подписку на сумму '.$amount.' руб.<br><br>

	Установка:<br>
	Программа сжата в zip файл (для уменьшения объема скачивания). <br>
	1. Кликните правой кнопкой мыши на скаченный файл и в появившемся списке выберете "Извлечь все" или "Извлечь файлы". <br>
	2. Зайдите в извлеченную папку и запустите setup. Начнется установка.';
	
	mail($email, $tema, $mess, $mail_form);	
}









