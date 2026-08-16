<?php

require_once __DIR__ . '/../../lib/response.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

json_error('Direct subscription creation is disabled', 403, [
    'code' => 'subscription_create_disabled',
]);
