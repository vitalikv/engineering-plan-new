<?php

require_once __DIR__ . '/../db.php';

const AUTH_TOKEN_TYPE_EMAIL_VERIFICATION = 'email_verification';
const AUTH_TOKEN_TYPE_PASSWORD_RESET = 'password_reset';

function auth_token_hash(string $token): string
{
    return hash('sha256', $token);
}

function auth_token_expiration_for_type(string $type): int
{
    if ($type === AUTH_TOKEN_TYPE_PASSWORD_RESET) {
        return 60 * 60;
    }

    return 24 * 60 * 60;
}

function auth_revoke_tokens(int $userId, string $type): void
{
    $stmt = db()->prepare(
        'UPDATE user_tokens
         SET used_at = COALESCE(used_at, :used_at)
         WHERE user_id = :user_id
           AND type = :type
           AND used_at IS NULL'
    );
    $stmt->execute([
        'used_at' => date('Y-m-d H:i:s'),
        'user_id' => $userId,
        'type' => $type,
    ]);
}

function auth_create_token(int $userId, string $type): array
{
    auth_revoke_tokens($userId, $type);

    $token = bin2hex(random_bytes(32));
    $createdAt = date('Y-m-d H:i:s');
    $expiresAt = date('Y-m-d H:i:s', time() + auth_token_expiration_for_type($type));

    $stmt = db()->prepare(
        'INSERT INTO user_tokens (user_id, type, token_hash, expires_at, created_at)
         VALUES (:user_id, :type, :token_hash, :expires_at, :created_at)'
    );
    $stmt->execute([
        'user_id' => $userId,
        'type' => $type,
        'token_hash' => auth_token_hash($token),
        'expires_at' => $expiresAt,
        'created_at' => $createdAt,
    ]);

    return [
        'token' => $token,
        'expiresAt' => $expiresAt,
    ];
}

function auth_find_active_token(string $rawToken, string $type): ?array
{
    if ($rawToken === '') {
        return null;
    }

    $stmt = db()->prepare(
        'SELECT ut.id, ut.user_id, ut.type, ut.expires_at, ut.used_at, ut.created_at,
                u.id AS resolved_user_id, u.email, u.password_hash, u.status, u.email_verified_at, u.created_at AS user_created_at, u.updated_at, u.deleted_at
         FROM user_tokens ut
         INNER JOIN users u ON u.id = ut.user_id
         WHERE ut.token_hash = :token_hash
           AND ut.type = :type
         LIMIT 1'
    );
    $stmt->execute([
        'token_hash' => auth_token_hash($rawToken),
        'type' => $type,
    ]);

    $row = $stmt->fetch();
    if (!is_array($row)) {
        return null;
    }

    if (($row['used_at'] ?? null) !== null) {
        return null;
    }

    if (($row['deleted_at'] ?? null) !== null) {
        return null;
    }

    if (strtotime((string)$row['expires_at']) < time()) {
        return null;
    }

    return $row;
}

function auth_mark_token_used(int $tokenId): void
{
    $stmt = db()->prepare(
        'UPDATE user_tokens
         SET used_at = :used_at
         WHERE id = :id
           AND used_at IS NULL'
    );
    $stmt->execute([
        'used_at' => date('Y-m-d H:i:s'),
        'id' => $tokenId,
    ]);
}
