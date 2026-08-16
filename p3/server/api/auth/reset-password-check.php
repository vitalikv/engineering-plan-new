<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/auth/password-reset.php';

init_json_api(['GET', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    json_error('Method not allowed', 405);
}

$token = trim((string)($_GET['token'] ?? ''));

if ($token === '') {
    json_error('Reset token is required', 400);
}

try {
    auth_assert_password_reset_token($token);
    json_success(['ok' => true, 'valid' => true]);
} catch (RuntimeException $e) {
    json_error($e->getMessage(), 400, ['code' => 'invalid_reset_token']);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to validate reset token', 500);
}
