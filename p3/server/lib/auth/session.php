<?php

function is_https_request(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }

    $forwardedProto = $_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '';
    return is_string($forwardedProto) && strtolower($forwardedProto) === 'https';
}

function auth_session_start(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_name('wf3_session');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => is_https_request(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function auth_current_user_id(): ?int
{
    auth_session_start();

    $userId = $_SESSION['user_id'] ?? null;
    if (is_int($userId) && $userId > 0) {
        return $userId;
    }
    if (is_string($userId) && ctype_digit($userId)) {
        return (int)$userId;
    }

    return null;
}

function auth_login_user(int $userId): void
{
    auth_session_start();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
}

function auth_logout_user(): void
{
    auth_session_start();

    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 3600, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }

    session_destroy();
}
