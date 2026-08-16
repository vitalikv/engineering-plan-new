<?php

require_once __DIR__ . '/config.php';

function mail_send_html(string $to, string $subject, string $html): array
{
    $encodedName = '=?UTF-8?B?' . base64_encode(mail_from_name()) . '?=';
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $encodedName . ' <' . mail_from_email() . '>',
        'Reply-To: ' . mail_from_email(),
    ];

    $sent = @mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $html, implode("\r\n", $headers));

    return [
        'sent' => $sent,
    ];
}

function mail_send_email_verification(string $email, string $token): array
{
    $url = mail_app_base_url() . '/?authAction=verify-email&token=' . rawurlencode($token);
    $subject = 'Подтверждение email';
    $html = ''
        . '<h2 style="margin: 0 0 16px;">Подтвердите email</h2>'
        . '<p style="margin: 0 0 12px;">Вы зарегистрировались в Engineering Plan.</p>'
        . '<p style="margin: 0 0 16px;">Чтобы завершить регистрацию, перейдите по ссылке:</p>'
        . '<p style="margin: 0 0 16px;"><a href="' . htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '">' . htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</a></p>'
        . '<p style="margin: 0; color: #666;">Ссылка действует 24 часа.</p>';

    return mail_send_html($email, $subject, $html);
}

function mail_send_password_reset(string $email, string $token): array
{
    $url = mail_app_base_url() . '/?authAction=reset-password&token=' . rawurlencode($token);
    $subject = 'Сброс пароля';
    $html = ''
        . '<h2 style="margin: 0 0 16px;">Сброс пароля</h2>'
        . '<p style="margin: 0 0 12px;">Получен запрос на обновление пароля для Engineering Plan.</p>'
        . '<p style="margin: 0 0 16px;">Чтобы задать новый пароль, перейдите по ссылке:</p>'
        . '<p style="margin: 0 0 16px;"><a href="' . htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '">' . htmlspecialchars($url, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</a></p>'
        . '<p style="margin: 0; color: #666;">Ссылка действует 60 минут. Если это были не вы, просто проигнорируйте письмо.</p>';

    return mail_send_html($email, $subject, $html);
}
