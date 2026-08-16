<?php

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/tokens.php';
require_once __DIR__ . '/../mail/mailer.php';

function auth_send_password_reset_email(string $email): void
{
    $user = auth_find_user_by_email($email);
    if ($user === null) {
        return;
    }

    if (($user['deleted_at'] ?? null) !== null || ($user['status'] ?? 'active') !== 'active') {
        return;
    }

    if (!auth_is_email_verified($user)) {
        return;
    }

    $tokenData = auth_create_token((int)$user['id'], AUTH_TOKEN_TYPE_PASSWORD_RESET);
    mail_send_password_reset((string)$user['email'], (string)$tokenData['token']);
}

function auth_assert_password_reset_token(string $token): array
{
    $tokenRow = auth_find_active_token($token, AUTH_TOKEN_TYPE_PASSWORD_RESET);
    if ($tokenRow === null) {
        throw new RuntimeException('Invalid or expired reset token');
    }

    return $tokenRow;
}

function auth_reset_password_by_token(string $token, string $password): array
{
    $tokenRow = auth_assert_password_reset_token($token);
    $userId = (int)$tokenRow['user_id'];

    auth_update_password($userId, $password);
    auth_mark_token_used((int)$tokenRow['id']);
    auth_revoke_tokens($userId, AUTH_TOKEN_TYPE_PASSWORD_RESET);

    $user = auth_find_user_by_id($userId);
    if ($user === null) {
        throw new RuntimeException('User not found');
    }

    return $user;
}
