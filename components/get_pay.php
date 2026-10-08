<?php
// платеж с мани пришел
// скрипт обновляет оплату (в таблице payment) и создает/обновляет поле с днями (в таблице subscription) и отправляет сообщение об оплате

header('Content-Type: application/json; charset=utf-8');





if(1===1)
{
	$secret = 'bfpLkrbKvuwpaNMiuzIX34jN'; // секрет, который мы получили в первом шаге от яндекс.
	// получение данных.
	$xdc = array(
		'notification_type' => isset($_POST['notification_type']) ? $_POST['notification_type'] : '', // p2p-incoming / card-incoming - с кошелька / с карты
		'operation_id'      => isset($_POST['operation_id']) ? $_POST['operation_id'] : '',      // Идентификатор операции в истории счета получателя.
		'amount'            => isset($_POST['amount']) ? $_POST['amount'] : '',            // Сумма, которая зачислена на счет получателя.
		'withdraw_amount'   => isset($_POST['withdraw_amount']) ? $_POST['withdraw_amount'] : '',   // Сумма, которая списана со счета отправителя.
		'currency'          => isset($_POST['currency']) ? $_POST['currency'] : '',            // Код валюты — всегда 643 (рубль РФ согласно ISO 4217).
		'datetime'          => isset($_POST['datetime']) ? $_POST['datetime'] : '',          // Дата и время совершения перевода.
		'sender'            => isset($_POST['sender']) ? $_POST['sender'] : '',            // Для переводов из кошелька — номер счета отправителя. Для переводов с произвольной карты — параметр содержит пустую строку.
		'codepro'           => isset($_POST['codepro']) ? $_POST['codepro'] : '',           // Для переводов из кошелька — перевод защищен кодом протекции. Для переводов с произвольной карты — всегда false.
		'label'             => isset($_POST['label']) ? $_POST['label'] : '',             // Метка платежа. Если ее нет, параметр содержит пустую строку.
		'sign'              => isset($_POST['sign']) ? $_POST['sign'] : ''                 // HMAC-SHA256 подпись уведомления.
	);

	// проверка подписи уведомления
	if (!checkYooMoneySign($_POST, $secret, $xdc)) 
	{
		exit; // останавливаем скрипт, если верификация не пройдена
	}	
}

$label = $xdc['label'];
$amount = $xdc['withdraw_amount'];

//if($amount != '1450.00'){exit;}		// сумма не равна нужной


//$label = 'id=3&token=db7722b86649cb0f4e23ed8112b3d092';
//$amount = 160;


// парсим строку на значения
parse_str($label, $str);
$user_project = isset($str['project']) ? $str['project'] : '';


// программа "теплый пол" (новая, auto_wf) обслуживает свои платежи сама: у нее
// другая база (skeleton_wf), другая схема и другой расчет дней - сумма там
// записана в самом заказе, а не выводится из платежа. Поэтому здесь только
// пересылка: тело уходит как пришло, ответ возвращается ее же.
//
// Ветка стоит до разбора остальной метки: токена пользователя в ней нет, и
// чтение $str['token'] дало бы warning - а он, попав в ответ, не дает выставить
// код ответа для ЮMoney.
if($user_project == 'skeleton_wf')
{
	sendToSkeletonWf();
	exit;
}


$paymentId = $str['id'];
$user_token = $str['token'];


$dbname = 'engineering-plan';
if($user_project == 'wf1') $dbname = 'eng_1';
$upass = '';
if($_SERVER['SERVER_NAME']=='engineering-plan.ru') $upass = 'ns62QYhqMf';

try
{
	$db = new PDO('mysql:host=localhost;dbname='.$dbname, 'root', $upass);
	$db->exec("set names utf8");
}
catch(PDOException $e)
{
    echo 'Ошибка 1';
}



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
		
		// сообщения не проходят, похоже сообщение можно отпровлять только со своего домена
		//if($user_project == 'wf1'){ sendMess_2($user['mail'], $data['days']); }
		//else { sendMess_1($user['mail'], $amount); }				
	}
}

echo json_encode( $data );


// пересылаем уведомление программе "теплый пол" (auto_wf) как есть
//
// Тело берется сырым (php://input), а не собирается заново из $_POST: подпись
// считается по всем пришедшим полям, и стоит ЮMoney добавить новое, как
// пересобранное тело перестанет ей соответствовать.
//
// Ответ отдаем тот, что вернула программа: 200 значит "разобрано, повторять
// нечего", а на все остальное ЮMoney пришлет уведомление еще раз. Не достучались
// (сеть, программа лежит) - тоже просим повторить, иначе оплата пропадет.
function sendToSkeletonWf()
{
	// адрес выбираем по домену - так же, как пароль базы выше: на боевом это
	// собственный домен программы, на машине разработчика - домен skeleton-wf
	// под OpenServer
	//
	// С августа 2026 программа стоит на своем сервере (ingplan.ru), а не в
	// подпапке auto_wf на кириллическом домене: теперь это две разные машины, и
	// уведомление уходит наружу по сети, а не внутрь той же файловой системы.
	$url = 'http://skeleton-wf/server/api/subscription/yoomoney';
	if($_SERVER['SERVER_NAME'] == 'engineering-plan.ru')
	{
		$url = 'https://ingplan.ru/server/api/subscription/yoomoney';
	}

	header('Content-Type: text/plain; charset=utf-8');

	$body = file_get_contents('php://input');
	if($body === false || $body === '') $body = http_build_query($_POST);

	$code = 0;
	$answer = '';
	$fail = '';

	if(function_exists('curl_init'))
	{
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/x-www-form-urlencoded'));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_TIMEOUT, 20);
		// соединение отдельно от общего таймаута: машина программы теперь чужая, и
		// недоступный сервер должен отвалиться за секунды, а не держать все 20 -
		// ЮMoney ждет ответа ограниченное время и молчание считает сбоем
		curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 7);
		$answer = curl_exec($ch);
		$code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$fail = curl_error($ch);
		curl_close($ch);
	}
	else
	{
		// на случай сборки PHP без curl
		$context = stream_context_create(array('http' => array(
			'method'        => 'POST',
			'header'        => "Content-Type: application/x-www-form-urlencoded\r\n",
			'content'       => $body,
			'timeout'       => 20,
			'ignore_errors' => true,
		)));

		$answer = file_get_contents($url, false, $context);

		if(isset($http_response_header[0]) && preg_match('~\s(\d{3})\s~', $http_response_header[0], $m))
		{
			$code = (int)$m[1];
		}
	}

	if($code === 0)
	{
		// причину пишем в лог: адрес внешний, и «не достучались» теперь может
		// означать и просроченный сертификат, и старый список корневых CA на этой
		// машине - без текста ошибки такое не отличить от лежащего сервера
		error_log('[get_pay] skeleton_wf unreachable ('.($fail !== '' ? $fail : 'причина неизвестна').'), url: '.$url.', label: '.(isset($_POST['label']) ? $_POST['label'] : ''));
		$code = 502;
	}

	http_response_code($code);
	echo is_string($answer) ? $answer : '';
}


// проверяем подпись уведомления ЮMoney
function checkYooMoneySign($post, $secret, $xdc)
{
	if(empty($post['sign'])) return false;
	
	$params = $post;
	unset($params['sign']);
	ksort($params, SORT_STRING);
	
	$parts = [];
	foreach($params as $key => $value)
	{
		if(is_array($value)) continue;
		$parts[] = $key.'='.rawurlencode((string)$value);
	}
	
	$sign = hash_hmac('sha256', implode('&', $parts), $secret);
	
	return compareHash($sign, $post['sign']);
}


// сравниваем хеши без утечки по времени, с поддержкой старых версий PHP
function compareHash($hash1, $hash2)
{
	if(function_exists('hash_equals'))
	{
		return hash_equals($hash1, $hash2);
	}
	
	if(strlen($hash1) !== strlen($hash2)) return false;
	
	$res = 0;
	for($i = 0; $i < strlen($hash1); $i++)
	{
		$res |= ord($hash1[$i]) ^ ord($hash2[$i]);
	}
	
	return $res === 0;
}



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
	//$priceDay = 2;		// цена подписки за день	
	//$days = (float)$amount / $priceDay;	
	//return round($days, 0, PHP_ROUND_HALF_UP);
	
	$days = 0;
	
	if($amount == '300') $days = 30;
	if($amount == '550') $days = 60;
	if($amount == '750') $days = 90;
	
	return $days;
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
function sendMess_1($mail, $amount)
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


// отправляем сообщение об оплате 
function sendMess_2($mail, $days)
{
	$mail_form = "Content-type:text/html; Charset=utf-8\r\nFrom:mail@xn------6cdcklga3agac0adveeerahel6btn3c.xn--p1ai";

	$arrayTo = array($mail.', otoplenie-doma-1@mail.ru');
	$email = implode(",", $arrayTo);

	$tema = "Программа теплый пол «активирована подписка»";
	$mess = 'Здравствуйте, вы активировали подписку на '.$days.' дней на сайте отопление-дома-своими-руками.рф (программа теплый пол).';	
	
	mail($email, $tema, $mess, $mail_form);	
}








