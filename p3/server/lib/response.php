<?php

function response_env(string $key, string $default = ''): string
{
    $value = getenv($key);
    return is_string($value) && $value !== '' ? $value : $default;
}

function get_request_origin(): ?string
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? null;
    return is_string($origin) && $origin !== '' ? $origin : null;
}

function get_request_ip(): string
{
    $forwardedFor = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if (is_string($forwardedFor) && $forwardedFor !== '') {
        $parts = explode(',', $forwardedFor);
        $candidate = trim($parts[0] ?? '');
        if ($candidate !== '') {
            return $candidate;
        }
    }

    $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';
    return is_string($remoteAddr) && $remoteAddr !== '' ? $remoteAddr : 'unknown';
}

function allowed_cors_origins(): array
{
    $configured = response_env('ALLOWED_ORIGINS');
    if ($configured !== '') {
        $origins = array_filter(array_map('trim', explode(',', $configured)));
        return array_values(array_unique($origins));
    }

    return [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://warm-floor-3',
        'https://warm-floor-3',
        'http://engineering-plan.ru',
        'https://engineering-plan.ru',
        'http://www.engineering-plan.ru',
        'https://www.engineering-plan.ru',
    ];
}

function is_allowed_cors_origin(string $origin): bool
{
    return in_array($origin, allowed_cors_origins(), true);
}

function init_json_api(array $allowedMethods): void
{
    $origin = get_request_origin();

    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Methods: ' . implode(', ', $allowedMethods));
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    if ($origin !== null && is_allowed_cors_origin($origin)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true');
        header('Vary: Origin');
    } elseif ($origin === null) {
        header('Access-Control-Allow-Origin: *');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        if ($origin !== null && !is_allowed_cors_origin($origin)) {
            http_response_code(403);
            exit;
        }
        http_response_code(204);
        exit;
    }

    if ($origin !== null && !is_allowed_cors_origin($origin)) {
        json_error('Origin is not allowed', 403, ['code' => 'origin_not_allowed']);
    }
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_success(array $payload = [], int $status = 200): void
{
    json_response($payload, $status);
}

function json_error(string $message, int $status = 400, array $extra = []): void
{
    json_response(array_merge(['error' => $message], $extra), $status);
}
