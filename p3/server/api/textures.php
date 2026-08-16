<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dir = __DIR__ . '/../storage/textures';
$allowed = ['jpg', 'jpeg', 'png', 'webp'];

if (!is_dir($dir)) {
    echo json_encode(['items' => []]);
    exit;
}

$files = [];
foreach (scandir($dir) as $file) {
    if ($file === '.' || $file === '..') continue;
    if (is_dir($dir . '/' . $file)) continue;
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    if (in_array($ext, $allowed, true)) {
        $files[] = $file;
    }
}

// Сортировка: w* (стены), f* (полы), остальные
usort($files, function ($a, $b) {
    $order = function ($name) {
        if (strpos($name, 'w') === 0) return 0;
        if (strpos($name, 'f') === 0) return 1;
        return 2;
    };
    $diff = $order($a) - $order($b);
    return $diff !== 0 ? $diff : strnatcasecmp($a, $b);
});

echo json_encode(['items' => $files]);
