<?php

require_once __DIR__ . '/db.php';

function payment_create(int $userId, int $months, int $amount): array
{
    $now = date('Y-m-d H:i:s');

    $stmt = db()->prepare(
        'INSERT INTO payments (user_id, buy, amount, months, created_at)
         VALUES (:user_id, 0, :amount, :months, :created_at)'
    );
    $stmt->execute([
        'user_id' => $userId,
        'amount' => $amount,
        'months' => $months,
        'created_at' => $now,
    ]);

    return [
        'id' => (int)db()->lastInsertId(),
        'user_id' => $userId,
        'buy' => 0,
        'amount' => $amount,
        'months' => $months,
        'created_at' => $now,
    ];
}

function payment_find_by_id(int $paymentId): ?array
{
    $stmt = db()->prepare(
        'SELECT id, user_id, buy, amount, months, created_at
         FROM payments
         WHERE id = :id
         LIMIT 1'
    );
    $stmt->execute(['id' => $paymentId]);
    $row = $stmt->fetch();

    return is_array($row) ? $row : null;
}

function payment_mark_paid(int $paymentId, int $amount): bool
{
    $stmt = db()->prepare(
        'UPDATE payments
         SET buy = 1, amount = :amount
         WHERE id = :id AND buy = 0
         LIMIT 1'
    );
    $stmt->execute([
        'amount' => $amount,
        'id' => $paymentId,
    ]);

    return $stmt->rowCount() > 0;
}

function payment_public_payload(array $payment): array
{
    return [
        'id' => (int)$payment['id'],
        'buy' => (int)$payment['buy'],
        'amount' => (int)$payment['amount'],
        'months' => (int)$payment['months'],
        'createdAt' => (string)$payment['created_at'],
    ];
}
