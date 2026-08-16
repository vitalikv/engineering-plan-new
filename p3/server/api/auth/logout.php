<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/auth/session.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

auth_logout_user();

json_success(['ok' => true]);
