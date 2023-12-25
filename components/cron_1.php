<?php
// скрипт списывает дни в таблице subscription

header('Content-Type: application/json; charset=utf-8');

require_once ($_SERVER['DOCUMENT_ROOT']."/include/bd.php");


// данные на выход
$data = [];
$data['result'] = false;

$sql = "UPDATE subscription SET days = days - 1 WHERE days > 0";
$r = $db->prepare($sql);
$r->execute();

$count = $r->rowCount();

if($count > 0)
{
	$data['result'] = true;
	$data['count'] = $count;
}

// отдаем результат в json
echo json_encode( $data );




