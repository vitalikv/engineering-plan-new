<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/auth/validation.php';
require_once __DIR__ . '/../../lib/auth/password-reset.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = json_input();
$token = trim((string)($body['token'] ?? ''));
$password = (string)($body['password'] ?? '');
$confirmPassword = (string)($body['confirmPassword'] ?? '');

if ($token === '') {
    json_error('Reset token is required', 400);
}

if (!auth_validate_password($password)) {
    json_error('Password must contain from 6 to 64 characters', 400);
}

if ($password !== $confirmPassword) {
    json_error('Passwords do not match', 400);
}

try {
    auth_reset_password_by_token($token, $password);
    json_success(['ok' => true]);
} catch (RuntimeException $e) {
    json_error($e->getMessage(), 400, ['code' => 'invalid_reset_token']);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to reset password', 500);
}
