<?php

function subscription_plan_catalog(): array
{
    return [
        1 => [
            'tariff' => 'start',
            'days' => 30,
            'amount' => 300,
        ],
        2 => [
            'tariff' => 'start',
            'days' => 60,
            'amount' => 550,
        ],
        3 => [
            'tariff' => 'start',
            'days' => 90,
            'amount' => 750,
        ],
    ];
}

function subscription_plan_by_months(int $months): ?array
{
    $plans = subscription_plan_catalog();

    return $plans[$months] ?? null;
}
