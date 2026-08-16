<?php

require_once __DIR__ . '/db.php';

function subscription_get_active(int $userId): ?array
{
    $stmt = db()->prepare(
        'SELECT id, user_id, tariff, days, created_at
         FROM subscriptions
         WHERE user_id = :user_id
           AND DATE_ADD(created_at, INTERVAL days DAY) > NOW()
         ORDER BY created_at DESC
         LIMIT 1'
    );
    $stmt->execute(['user_id' => $userId]);
    $row = $stmt->fetch();

    return is_array($row) ? $row : null;
}

function subscription_remaining_days(array $sub): int
{
    $expiresTs = strtotime($sub['created_at']) + (int)$sub['days'] * 86400;
    $remaining = (int)ceil(($expiresTs - time()) / 86400);

    return max(0, $remaining);
}

function subscription_create(int $userId, string $tariff, int $days): array
{
    $now = date('Y-m-d H:i:s');

    $stmt = db()->prepare(
        'INSERT INTO subscriptions (user_id, tariff, days, created_at)
         VALUES (:user_id, :tariff, :days, :created_at)'
    );
    $stmt->execute([
        'user_id' => $userId,
        'tariff' => $tariff,
        'days' => $days,
        'created_at' => $now,
    ]);

    return [
        'id' => (int)db()->lastInsertId(),
        'user_id' => $userId,
        'tariff' => $tariff,
        'days' => $days,
        'created_at' => $now,
    ];
}

function subscription_public_payload(?array $sub): array
{
    if ($sub === null) {
        return [
            'active' => false,
            'tariff' => null,
            'days' => 0,
            'remainingDays' => 0,
            'expiresAt' => null,
        ];
    }

    $expiresTs = strtotime($sub['created_at']) + (int)$sub['days'] * 86400;

    return [
        'active' => $expiresTs > time(),
        'tariff' => (string)$sub['tariff'],
        'days' => (int)$sub['days'],
        'remainingDays' => subscription_remaining_days($sub),
        'expiresAt' => date('Y-m-d H:i:s', $expiresTs),
    ];
}
