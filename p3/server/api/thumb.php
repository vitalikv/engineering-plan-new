<?php
header('Access-Control-Allow-Origin: *');

$file = $_GET['file'] ?? '';
$safe = basename($file);
$allowed = ['jpg', 'jpeg', 'png', 'webp'];
$ext = strtolower(pathinfo($safe, PATHINFO_EXTENSION));

if (!$safe || !in_array($ext, $allowed, true)) {
    http_response_code(400);
    exit;
}

$storageDir = __DIR__ . '/../storage/textures';
$original   = $storageDir . '/' . $safe;
$thumbDir   = $storageDir . '/thumbs';
$thumbPath  = $thumbDir . '/' . $safe;

if (!is_file($original)) {
    http_response_code(404);
    exit;
}

// Если thumb актуален — отдать
if (is_file($thumbPath) && filemtime($thumbPath) >= filemtime($original)) {
    $mime = ($ext === 'png') ? 'image/png' : (($ext === 'webp') ? 'image/webp' : 'image/jpeg');
    header('Content-Type: ' . $mime);
    header('Cache-Control: public, max-age=31536000');
    readfile($thumbPath);
    exit;
}

// Генерация thumb
$size = 100;

$info = getimagesize($original);
if (!$info) { http_response_code(500); exit; }

[$origW, $origH] = $info;
$type = $info[2];

switch ($type) {
    case IMAGETYPE_JPEG: $src = imagecreatefromjpeg($original); break;
    case IMAGETYPE_PNG:  $src = imagecreatefrompng($original);  break;
    case IMAGETYPE_WEBP: $src = imagecreatefromwebp($original); break;
    default: http_response_code(415); exit;
}

// Cover-crop: вырезаем центральный квадрат
$min = min($origW, $origH);
$srcX = (int)(($origW - $min) / 2);
$srcY = (int)(($origH - $min) / 2);

$thumb = imagecreatetruecolor($size, $size);

if ($type === IMAGETYPE_PNG) {
    imagealphablending($thumb, false);
    imagesavealpha($thumb, true);
}

imagecopyresampled($thumb, $src, 0, 0, $srcX, $srcY, $size, $size, $min, $min);
imagedestroy($src);

// Сохранить на диск (атомарно через temp + rename)
if (!is_dir($thumbDir)) {
    mkdir($thumbDir, 0755, true);
}

$tmpFile = $thumbDir . '/tmp_' . uniqid() . '_' . $safe;

switch ($type) {
    case IMAGETYPE_JPEG: imagejpeg($thumb, $tmpFile, 85);  $mime = 'image/jpeg'; break;
    case IMAGETYPE_PNG:  imagepng($thumb, $tmpFile, 8);     $mime = 'image/png';  break;
    case IMAGETYPE_WEBP: imagewebp($thumb, $tmpFile, 85);   $mime = 'image/webp'; break;
}

imagedestroy($thumb);
rename($tmpFile, $thumbPath);

header('Content-Type: ' . $mime);
header('Cache-Control: public, max-age=31536000');
readfile($thumbPath);
