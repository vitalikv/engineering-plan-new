<?php

require_once __DIR__ . '/../db.php';
require_once __DIR__ . '/session.php';

function auth_user_public_payload(array $user): array
{
    return [
        'id' => (int)$user['id'],
        'email' => (string)$user['email'],
        'emailVerified' => auth_is_email_verified($user),
    ];
}

function auth_is_email_verified(array $user): bool
{
    return ($user['email_verified_at'] ?? null) !== null;
}

function auth_find_user_by_email(string $email): ?array
{
    $stmt = db()->prepare(
        'SELECT id, email, password_hash, status, email_verified_at, created_at, updated_at, deleted_at
         FROM users
         WHERE email = :email
         LIMIT 1'
    );
    $stmt->execute(['email' => mb_strtolower(trim($email))]);
    $user = $stmt->fetch();

    return is_array($user) ? $user : null;
}

function auth_find_user_by_id(int $id): ?array
{
    $stmt = db()->prepare(
        'SELECT id, email, password_hash, status, email_verified_at, created_at, updated_at, deleted_at
         FROM users
         WHERE id = :id
         LIMIT 1'
    );
    $stmt->execute(['id' => $id]);
    $user = $stmt->fetch();

    return is_array($user) ? $user : null;
}

function auth_create_user(string $email, string $password): array
{
    $normalizedEmail = mb_strtolower(trim($email));
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $now = date('Y-m-d H:i:s');

    $stmt = db()->prepare(
        'INSERT INTO users (email, password_hash, status, created_at, updated_at)
         VALUES (:email, :password_hash, :status, :created_at, :updated_at)'
    );
    $stmt->execute([
        'email' => $normalizedEmail,
        'password_hash' => $passwordHash,
        'status' => 'active',
        'created_at' => $now,
        'updated_at' => $now,
    ]);

    $userId = (int)db()->lastInsertId();
    $user = auth_find_user_by_id($userId);

    if ($user === null) {
        throw new RuntimeException('Failed to load created user');
    }

    return $user;
}

function auth_verify_credentials(string $email, string $password): ?array
{
    $user = auth_find_user_by_email($email);
    if ($user === null) {
        return null;
    }

    if (($user['deleted_at'] ?? null) !== null) {
        return null;
    }

    if (($user['status'] ?? 'active') !== 'active') {
        return null;
    }

    if (!password_verify($password, (string)$user['password_hash'])) {
        return null;
    }

    return $user;
}

function auth_mark_email_verified(int $userId): void
{
    $now = date('Y-m-d H:i:s');
    $stmt = db()->prepare(
        'UPDATE users
         SET email_verified_at = COALESCE(email_verified_at, :email_verified_at),
             updated_at = :updated_at
         WHERE id = :id'
    );
    $stmt->execute([
        'email_verified_at' => $now,
        'updated_at' => $now,
        'id' => $userId,
    ]);
}

function auth_update_password(int $userId, string $password): void
{
    $stmt = db()->prepare(
        'UPDATE users
         SET password_hash = :password_hash,
             updated_at = :updated_at
         WHERE id = :id'
    );
    $stmt->execute([
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'updated_at' => date('Y-m-d H:i:s'),
        'id' => $userId,
    ]);
}

function auth_current_user(): ?array
{
    $userId = auth_current_user_id();
    if ($userId === null) {
        return null;
    }

    $user = auth_find_user_by_id($userId);
    if ($user === null || ($user['deleted_at'] ?? null) !== null || ($user['status'] ?? 'active') !== 'active') {
        auth_logout_user();
        return null;
    }

    return $user;
}
