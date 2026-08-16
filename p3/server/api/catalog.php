<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$storageDir = __DIR__ . '/../storage/catalog';
$baseStorageUrl = '/storage/catalog';

$uuid = $_GET['uuid'] ?? null;

if ($uuid) {
    // ── Detail: single item by UUID ──
    $safeUuid = basename($uuid);
    $itemDir = $storageDir . '/' . $safeUuid;
    $metaFile = $itemDir . '/meta.json';

    if (!is_file($metaFile)) {
        http_response_code(404);
        echo json_encode(['error' => 'Item not found']);
        exit;
    }

    $meta = json_decode(file_get_contents($metaFile), true);
    if (!$meta) {
        http_response_code(500);
        echo json_encode(['error' => 'Invalid meta.json']);
        exit;
    }

    $itemUrl = $baseStorageUrl . '/' . $safeUuid;
    $format = $meta['format'] ?? 'glb';

    echo json_encode([
        'uuid'        => $meta['uuid'] ?? $safeUuid,
        'name'        => $meta['name'] ?? 'Unknown',
        'format'      => $format,
        'category'    => $meta['category'] ?? '',
        'subcategory' => $meta['subcategory'] ?? '',
        'version'     => $meta['version'] ?? '1.0',
        'modelUrl'    => $itemUrl . '/model.' . $format,
        'previewUrl'  => $itemUrl . '/preview.png',
        'boundingBox' => $meta['boundingBox'] ?? ['x' => 1, 'y' => 1, 'z' => 1],
        'placement'   => $meta['placement'] ?? null,
        'parameters'  => $meta['parameters'] ?? null,
    ]);
} else {
    // ── List: all catalog items ──
    $items = [];

    $pattern = $storageDir . '/*/meta.json';
    foreach (glob($pattern) as $metaFile) {
        $meta = json_decode(file_get_contents($metaFile), true);
        if (!$meta || !isset($meta['uuid'])) continue;

        $itemUrl = $baseStorageUrl . '/' . $meta['uuid'];
        $items[] = [
            'uuid'        => $meta['uuid'],
            'name'        => $meta['name'] ?? 'Unknown',
            'format'      => $meta['format'] ?? 'glb',
            'category'    => $meta['category'] ?? '',
            'subcategory' => $meta['subcategory'] ?? '',
            'previewUrl'  => $itemUrl . '/preview.png',
            'boundingBox' => $meta['boundingBox'] ?? ['x' => 1, 'y' => 1, 'z' => 1],
        ];
    }

    echo json_encode(['items' => $items]);
}
