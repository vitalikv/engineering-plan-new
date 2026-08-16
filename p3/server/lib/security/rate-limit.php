<?php

require_once __DIR__ . '/../db.php';

function rate_limit_scope_key(string $scope): string
{
    return hash('sha256', $scope);
}

function rate_limit_consume(string $action, string $scope, int $maxAttempts, int $windowSeconds, ?int $blockSeconds = null): array
{
    $nowTs = time();
    $now = date('Y-m-d H:i:s', $nowTs);
    $windowStart = date('Y-m-d H:i:s', $nowTs);
    $blockedUntil = null;
    $scopeKey = rate_limit_scope_key($scope);
    $blockSeconds = $blockSeconds ?? $windowSeconds;

    $pdo = db();
    $pdo->beginTransaction();

    try {
        $stmt = $pdo->prepare(
            'SELECT id, hits, window_started_at, blocked_until
             FROM rate_limits
             WHERE action_name = :action_name AND scope_key = :scope_key
             LIMIT 1
             FOR UPDATE'
        );
        $stmt->execute([
            'action_name' => $action,
            'scope_key' => $scopeKey,
        ]);

        $row = $stmt->fetch();

        if (!is_array($row)) {
            $insert = $pdo->prepare(
                'INSERT INTO rate_limits (action_name, scope_key, hits, window_started_at, blocked_until, created_at, updated_at)
                 VALUES (:action_name, :scope_key, :hits, :window_started_at, :blocked_until, :created_at, :updated_at)'
            );
            $insert->execute([
                'action_name' => $action,
                'scope_key' => $scopeKey,
                'hits' => 1,
                'window_started_at' => $windowStart,
                'blocked_until' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $pdo->commit();

            return [
                'allowed' => true,
                'retryAfter' => 0,
            ];
        }

        $windowStartedTs = strtotime((string)$row['window_started_at']) ?: $nowTs;
        $blockedUntilTs = ($row['blocked_until'] ?? null) !== null ? (strtotime((string)$row['blocked_until']) ?: null) : null;
        $hits = (int)$row['hits'];

        if ($blockedUntilTs !== null && $blockedUntilTs > $nowTs) {
            $pdo->commit();

            return [
                'allowed' => false,
                'retryAfter' => max(1, $blockedUntilTs - $nowTs),
            ];
        }

        if (($nowTs - $windowStartedTs) >= $windowSeconds) {
            $hits = 0;
            $windowStartedTs = $nowTs;
            $blockedUntilTs = null;
        }

        $hits++;
        if ($hits > $maxAttempts) {
            $blockedUntilTs = $nowTs + $blockSeconds;
            $blockedUntil = date('Y-m-d H:i:s', $blockedUntilTs);
        }

        $update = $pdo->prepare(
            'UPDATE rate_limits
             SET hits = :hits,
                 window_started_at = :window_started_at,
                 blocked_until = :blocked_until,
                 updated_at = :updated_at
             WHERE id = :id'
        );
        $update->execute([
            'hits' => $hits,
            'window_started_at' => date('Y-m-d H:i:s', $windowStartedTs),
            'blocked_until' => $blockedUntil,
            'updated_at' => $now,
            'id' => $row['id'],
        ]);

        $pdo->commit();

        if ($blockedUntilTs !== null && $blockedUntilTs > $nowTs) {
            return [
                'allowed' => false,
                'retryAfter' => max(1, $blockedUntilTs - $nowTs),
            ];
        }

        return [
            'allowed' => true,
            'retryAfter' => 0,
        ];
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

function rate_limit_require(array $rules): void
{
    foreach ($rules as $rule) {
        $result = rate_limit_consume(
            (string)$rule['action'],
            (string)$rule['scope'],
            (int)$rule['maxAttempts'],
            (int)$rule['windowSeconds'],
            array_key_exists('blockSeconds', $rule) ? (int)$rule['blockSeconds'] : null
        );

        if ($result['allowed']) {
            continue;
        }

        header('Retry-After: ' . (string)$result['retryAfter']);
        json_error('Too many requests. Please try again later.', 429, [
            'code' => 'rate_limited',
            'retryAfter' => (int)$result['retryAfter'],
        ]);
    }
}
