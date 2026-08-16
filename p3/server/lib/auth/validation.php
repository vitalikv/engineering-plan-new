<?php

function auth_validate_email(string $email): bool
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function auth_validate_password(string $password): bool
{
    $length = mb_strlen($password);
    return $length >= 6 && $length <= 64;
}

function auth_validate_name(string $name): bool
{
    $length = mb_strlen(trim($name));
    return $length >= 1 && $length <= 120;
}
