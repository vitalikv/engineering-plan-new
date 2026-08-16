<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$storageDir = __DIR__ . '/../storage/textures';
$thumbDir   = $storageDir . '/thumbs';
$allowed    = ['jpg', 'jpeg', 'png', 'webp'];
$size       = 100;

if (!is_dir($storageDir)) {
    echo json_encode(['items' => new \stdClass()]);
    exit;
}

if (!is_dir($thumbDir)) {
    mkdir($thumbDir, 0755, true);
}

$result = [];

foreach (scandir($storageDir) as $file) {
    if ($file === '.' || $file === '..') continue;
    if (is_dir($storageDir . '/' . $file)) continue;
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed, true)) continue;

    $original  = $storageDir . '/' . $file;
    $thumbPath = $thumbDir . '/' . $file;

    // Генерация thumb если нет или устарел
    if (!is_file($thumbPath) || filemtime($thumbPath) < filemtime($original)) {
        $info = getimagesize($original);
        if (!$info) continue;

        [$origW, $origH] = $info;
        $type = $info[2];

        switch ($type) {
            case IMAGETYPE_JPEG: $src = imagecreatefromjpeg($original); break;
            case IMAGETYPE_PNG:  $src = imagecreatefrompng($original);  break;
            case IMAGETYPE_WEBP: $src = imagecreatefromwebp($original); break;
            default: continue 2;
        }

        $min  = min($origW, $origH);
        $srcX = (int)(($origW - $min) / 2);
        $srcY = (int)(($origH - $min) / 2);

        $thumb = imagecreatetruecolor($size, $size);
        if ($type === IMAGETYPE_PNG) {
            imagealphablending($thumb, false);
            imagesavealpha($thumb, true);
        }
        imagecopyresampled($thumb, $src, 0, 0, $srcX, $srcY, $size, $size, $min, $min);
        imagedestroy($src);

        $tmpFile = $thumbDir . '/tmp_' . uniqid() . '_' . $file;
        switch ($type) {
            case IMAGETYPE_JPEG: imagejpeg($thumb, $tmpFile, 85);  break;
            case IMAGETYPE_PNG:  imagepng($thumb, $tmpFile, 8);    break;
            case IMAGETYPE_WEBP: imagewebp($thumb, $tmpFile, 85);  break;
        }
        imagedestroy($thumb);
        rename($tmpFile, $thumbPath);
    }

    $data = file_get_contents($thumbPath);
    if ($data === false) continue;

    $mime = ($ext === 'png') ? 'image/png' : (($ext === 'webp') ? 'image/webp' : 'image/jpeg');
    $result[$file] = 'data:' . $mime . ';base64,' . base64_encode($data);
}

echo json_encode(['items' => $result]);
