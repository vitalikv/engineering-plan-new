<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/security/rate-limit.php';
require_once __DIR__ . '/../../lib/auth/validation.php';
require_once __DIR__ . '/../../lib/auth/auth.php';
require_once __DIR__ . '/../../lib/auth/verification.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = json_input();
$email = trim((string)($body['email'] ?? ''));
$password = (string)($body['password'] ?? '');
$confirmPassword = array_key_exists('confirmPassword', $body) ? (string)$body['confirmPassword'] : null;

rate_limit_require([
    [
        'action' => 'auth_register_ip',
        'scope' => get_request_ip(),
        'maxAttempts' => 5,
        'windowSeconds' => 60 * 60,
        'blockSeconds' => 60 * 60,
    ],
    [
        'action' => 'auth_register_ip_email',
        'scope' => get_request_ip() . '|' . mb_strtolower($email),
        'maxAttempts' => 3,
        'windowSeconds' => 60 * 60,
        'blockSeconds' => 60 * 60,
    ],
]);

if (!auth_validate_email($email)) {
    json_error('Invalid email', 400);
}

if (!auth_validate_password($password)) {
    json_error('Password must contain from 6 to 64 characters', 400);
}

if ($confirmPassword !== null && $password !== $confirmPassword) {
    json_error('Passwords do not match', 400);
}

try {
    if (auth_find_user_by_email($email) !== null) {
        json_error('Email is already in use', 409);
    }

    $user = auth_create_user($email, $password);
    $delivery = auth_send_verification_email($user);

    json_success([
        'authenticated' => false,
        'user' => null,
        'verificationRequired' => true,
        'email' => (string)$user['email'],
        'delivery' => [
            'sent' => (bool)($delivery['delivery']['sent'] ?? false),
        ],
    ], 201);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to register user', 500);
}
