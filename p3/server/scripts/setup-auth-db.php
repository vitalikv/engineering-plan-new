<?php

require_once __DIR__ . '/../lib/db.php';

$migrationFile = __DIR__ . '/../migrations/001_auth_init.sql';

if (!is_file($migrationFile)) {
    fwrite(STDERR, "Migration file not found: {$migrationFile}\n");
    exit(1);
}

$cfg = db_config();
$dsn = sprintf(
    'mysql:host=%s;port=%s;charset=%s',
    $cfg['host'],
    $cfg['port'],
    $cfg['charset']
);

$pdo = new PDO($dsn, $cfg['user'], $cfg['password'], [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

$sql = file_get_contents($migrationFile);
if ($sql === false) {
    fwrite(STDERR, "Failed to read migration file\n");
    exit(1);
}

$pdo->exec($sql);

fwrite(STDOUT, "Database schema is ready for `{$cfg['name']}`.\n");
