<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/auth/auth.php';

init_json_api(['GET', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    json_error('Method not allowed', 405);
}

try {
    $user = auth_current_user();

    json_success([
        'authenticated' => $user !== null,
        'user' => $user !== null ? auth_user_public_payload($user) : null,
    ]);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to restore session', 500);
}
