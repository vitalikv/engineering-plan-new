<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/security/rate-limit.php';
require_once __DIR__ . '/../../lib/auth/validation.php';
require_once __DIR__ . '/../../lib/auth/auth.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = json_input();
$email = trim((string)($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');

rate_limit_require([
    [
        'action' => 'auth_login_ip',
        'scope' => get_request_ip(),
        'maxAttempts' => 10,
        'windowSeconds' => 15 * 60,
        'blockSeconds' => 15 * 60,
    ],
    [
        'action' => 'auth_login_ip_email',
        'scope' => get_request_ip() . '|' . mb_strtolower($email),
        'maxAttempts' => 5,
        'windowSeconds' => 15 * 60,
        'blockSeconds' => 15 * 60,
    ],
]);

if (!auth_validate_email($email) || !auth_validate_password($password)) {
    json_error('Invalid email or password', 401);
}

try {
    $user = auth_verify_credentials($email, $password);
    if ($user === null) {
        json_error('Invalid email or password', 401);
    }

    if (!auth_is_email_verified($user)) {
        json_error('Email is not verified', 403, ['code' => 'email_not_verified']);
    }

    auth_login_user((int)$user['id']);

    json_success([
        'authenticated' => true,
        'user' => auth_user_public_payload($user),
    ]);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to login', 500);
}
