<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/auth/verification.php';

init_json_api(['GET', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    json_error('Method not allowed', 405);
}

$token = trim((string)($_GET['token'] ?? ''));

if ($token === '') {
    json_error('Verification token is required', 400);
}

try {
    $user = auth_verify_email_token($token);

    json_success([
        'ok' => true,
        'verified' => true,
        'user' => auth_user_public_payload($user),
    ]);
} catch (RuntimeException $e) {
    json_error($e->getMessage(), 400, ['code' => 'invalid_verification_token']);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to verify email', 500);
}
