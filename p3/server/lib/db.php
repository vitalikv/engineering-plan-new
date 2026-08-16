<?php

function db_env(string $key, string $default): string
{
    $value = getenv($key);
    return is_string($value) && $value !== '' ? $value : $default;
}

function db_config(): array
{
    return [
        'host' => db_env('DB_HOST', '127.0.0.1'),
        'port' => db_env('DB_PORT', '3306'),
        'name' => db_env('DB_NAME', 'engineering_plan_2'),
        'user' => db_env('DB_USER', 'root'),
        'password' => db_env('DB_PASSWORD', ''),
        'charset' => db_env('DB_CHARSET', 'utf8mb4'),
    ];
}

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $cfg = db_config();
    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s',
        $cfg['host'],
        $cfg['port'],
        $cfg['name'],
        $cfg['charset']
    );

    $pdo = new PDO($dsn, $cfg['user'], $cfg['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}
