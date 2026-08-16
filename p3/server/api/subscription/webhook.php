<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/payment.php';
require_once __DIR__ . '/../../lib/subscription.php';
require_once __DIR__ . '/../../lib/subscription-plans.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = json_input();
$paymentId = (int)($body['paymentId'] ?? 0);
$amount = (int)($body['amount'] ?? 0);

if ($paymentId <= 0 || $amount <= 0) {
    json_error('Invalid payment data', 400);
}

try {
    $payment = payment_find_by_id($paymentId);
    if ($payment === null) {
        json_error('Payment not found', 404);
    }

    if ((int)$payment['buy'] === 1) {
        json_success(['ok' => true, 'already' => true]);
    }

    $months = (int)$payment['months'];
    $plan = subscription_plan_by_months($months);
    if ($plan === null) {
        json_error('Payment plan is invalid', 500);
    }

    $expectedAmount = (int)$plan['amount'];
    if ((int)$payment['amount'] !== $expectedAmount) {
        json_error('Stored payment amount is invalid', 409);
    }
    if ($amount !== $expectedAmount) {
        json_error('Payment amount mismatch', 409);
    }

    $pdo = db();
    $pdo->beginTransaction();

    $updated = payment_mark_paid($paymentId, $amount);
    if (!$updated) {
        $pdo->rollBack();
        json_error('Failed to update payment', 409);
    }

    $days = (int)$plan['days'];
    $userId = (int)$payment['user_id'];

    subscription_create($userId, (string)$plan['tariff'], $days);

    $pdo->commit();

    json_success(['ok' => true]);
} catch (PDOException $e) {
    if (db()->inTransaction()) {
        db()->rollBack();
    }
    json_error('Database error', 500);
} catch (Throwable $e) {
    if (db()->inTransaction()) {
        db()->rollBack();
    }
    json_error('Failed to process payment', 500);
}
