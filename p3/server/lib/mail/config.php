<?php

function mail_env(string $key, string $default = ''): string
{
    $value = getenv($key);
    return is_string($value) && $value !== '' ? $value : $default;
}

function mail_app_base_url(): string
{
    $configured = trim(mail_env('APP_BASE_URL'));
    if ($configured !== '') {
        return rtrim($configured, '/');
    }

    $basePath = trim(mail_env('APP_BASE_PATH', '/construction_v1'));
    if ($basePath === '' || $basePath === '/') {
        $basePath = '';
    } else {
        $basePath = '/' . trim($basePath, '/');
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (is_string($origin) && $origin !== '') {
        return rtrim($origin, '/') . $basePath;
    }

    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';

    return rtrim($scheme . '://' . $host, '/') . $basePath;
}

function mail_from_email(): string
{
    $configured = trim(mail_env('MAIL_FROM_EMAIL'));
    if ($configured !== '') {
        return $configured;
    }

    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $host = preg_replace('/:\d+$/', '', (string)$host);

    return 'no-reply@' . $host;
}

function mail_from_name(): string
{
    return trim(mail_env('MAIL_FROM_NAME', 'Engineering Plan'));
}
