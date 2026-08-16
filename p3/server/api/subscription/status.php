<?php

require_once __DIR__ . '/../../lib/response.php';
require_once __DIR__ . '/../../lib/project-access.php';
require_once __DIR__ . '/../../lib/subscription.php';

init_json_api(['GET', 'OPTIONS']);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    json_error('Method not allowed', 405);
}

try {
    $user = require_authenticated_user();
    $sub = subscription_get_active((int)$user['id']);

    json_success(subscription_public_payload($sub));
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Failed to get subscription status', 500);
}
