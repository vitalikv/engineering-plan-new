<?php

require_once __DIR__ . '/response.php';
require_once __DIR__ . '/auth/auth.php';

function require_authenticated_user(): array
{
    $user = auth_current_user();
    if ($user === null) {
        json_error('Authentication required', 401);
    }

    return $user;
}
