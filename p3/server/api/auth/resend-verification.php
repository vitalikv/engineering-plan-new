<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/security/rate-limit.php';
require_once __DIR__ . '/../../lib/auth/validation.php';
require_once __DIR__ . '/../../lib/auth/verification.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = json_input();
$email = trim((string)($body['email'] ?? ''));

rate_limit_require([
    [
        'action' => 'auth_resend_verification_ip',
        'scope' => get_request_ip(),
        'maxAttempts' => 5,
        'windowSeconds' => 60 * 60,
        'blockSeconds' => 60 * 60,
    ],
    [
        'action' => 'auth_resend_verification_ip_email',
        'scope' => get_request_ip() . '|' . mb_strtolower($email),
        'maxAttempts' => 3,
        'windowSeconds' => 60 * 60,
        'blockSeconds' => 60 * 60,
    ],
]);

if (!auth_validate_email($email)) {
    json_error('Invalid email', 400);
}

try {
    auth_resend_verification_email($email);
    json_success(['ok' => true]);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to resend verification email', 500);
}
