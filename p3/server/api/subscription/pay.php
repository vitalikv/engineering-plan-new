<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/project-access.php';
require_once __DIR__ . '/../../lib/payment.php';
require_once __DIR__ . '/../../lib/subscription-plans.php';

init_json_api(['POST', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    json_error('Method not allowed', 405);
}

$body = json_input();
$months = (int)($body['months'] ?? 0);
$plan = subscription_plan_by_months($months);
if ($plan === null) {
    json_error('Invalid plan: months must be 1, 2 or 3', 400);
}

try {
    $user = require_authenticated_user();
    $payment = payment_create((int)$user['id'], $months, (int)$plan['amount']);

    json_success([
        'payment' => payment_public_payload($payment),
    ], 201);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to create payment', 500);
}
