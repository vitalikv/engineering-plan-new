<?php

require_once __DIR__ . '/../lib/response.php';
require_once __DIR__ . '/../lib/db.php';
require_once __DIR__ . '/../lib/project-access.php';

init_json_api(['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']);

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uuid = $_GET['uuid'] ?? null;
$user = require_authenticated_user();
$ownerId = (int)$user['id'];
$storageDir = __DIR__ . '/../storage/projects';

if (!is_dir($storageDir)) {
    mkdir($storageDir, 0755, true);
}

function sanitize_uuid(string $uuid): string
{
    return basename(trim($uuid));
}

function project_generate_uuid(): string
{
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}

function project_find_by_uuid_for_owner(string $uuid, int $ownerId): ?array
{
    $stmt = db()->prepare(
        'SELECT id, uuid, owner_id, name, storage_key, size_bytes, created_at, updated_at, deleted_at
         FROM projects
         WHERE uuid = :uuid AND owner_id = :owner_id AND deleted_at IS NULL
         LIMIT 1'
    );
    $stmt->execute([
        'uuid' => $uuid,
        'owner_id' => $ownerId,
    ]);

    $project = $stmt->fetch();
    return is_array($project) ? $project : null;
}

function project_data_path(string $storageDir, string $storageKey): string
{
    return $storageDir . '/' . basename($storageKey) . '/data.json';
}

function project_dir_path(string $storageDir, string $storageKey): string
{
    return $storageDir . '/' . basename($storageKey);
}

function write_project_meta_file(string $storageDir, array $project): void
{
    $projectDir = project_dir_path($storageDir, (string)$project['storage_key']);
    if (!is_dir($projectDir)) {
        mkdir($projectDir, 0755, true);
    }

    $meta = [
        'uuid' => $project['uuid'],
        'name' => $project['name'],
        'owner_id' => (int)$project['owner_id'],
        'created' => $project['created_at'],
        'modified' => $project['updated_at'],
    ];

    file_put_contents(
        $projectDir . '/meta.json',
        json_encode($meta, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
    );
}

try {
    if ($method === 'GET') {
        if ($uuid !== null && $uuid !== '') {
            $safeUuid = sanitize_uuid((string)$uuid);
            $project = project_find_by_uuid_for_owner($safeUuid, $ownerId);
            if ($project === null) {
                json_error('Project not found', 404);
            }

            $dataFile = project_data_path($storageDir, (string)$project['storage_key']);
            if (!is_file($dataFile)) {
                json_error('Project data not found', 404);
            }

            $payload = json_decode((string)file_get_contents($dataFile), true);
            if (!is_array($payload)) {
                json_error('Project data is corrupted', 500);
            }

            $payload['meta'] = [
                'uuid' => $project['uuid'],
                'name' => $project['name'],
                'modified' => $project['updated_at'],
            ];

            json_success($payload);
        }

        $stmt = db()->prepare(
            'SELECT uuid, name, updated_at
             FROM projects
             WHERE owner_id = :owner_id AND deleted_at IS NULL
             ORDER BY updated_at DESC'
        );
        $stmt->execute(['owner_id' => $ownerId]);

        $items = [];
        foreach ($stmt->fetchAll() as $row) {
            $items[] = [
                'uuid' => (string)$row['uuid'],
                'name' => (string)$row['name'],
                'modified' => (string)$row['updated_at'],
            ];
        }

        json_success(['items' => $items]);
    }

    if ($method === 'POST') {
        $contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
        if ($contentLength > 5 * 1024 * 1024) {
            json_error('Payload too large (max 5 MB)', 413);
        }

        $body = json_input();
        $name = trim((string)($body['name'] ?? ''));
        if ($name === '') {
            json_error('name is required', 400);
        }
        if (!array_key_exists('data', $body)) {
            json_error('data is required', 400);
        }

        $now = date('Y-m-d H:i:s');
        $jsonData = json_encode($body['data'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        if ($jsonData === false) {
            json_error('Failed to encode project data', 400);
        }

        $incomingUuid = isset($body['uuid']) ? sanitize_uuid((string)$body['uuid']) : null;
        $project = $incomingUuid ? project_find_by_uuid_for_owner($incomingUuid, $ownerId) : null;

        if ($project === null) {
            $newUuid = project_generate_uuid();
            $storageKey = $newUuid;
            $projectDir = project_dir_path($storageDir, $storageKey);
            if (!is_dir($projectDir)) {
                mkdir($projectDir, 0755, true);
            }

            file_put_contents($projectDir . '/data.json', $jsonData);
            $sizeBytes = filesize($projectDir . '/data.json');

            $stmt = db()->prepare(
                'INSERT INTO projects (uuid, owner_id, name, storage_key, size_bytes, created_at, updated_at)
                 VALUES (:uuid, :owner_id, :name, :storage_key, :size_bytes, :created_at, :updated_at)'
            );
            $stmt->execute([
                'uuid' => $newUuid,
                'owner_id' => $ownerId,
                'name' => $name,
                'storage_key' => $storageKey,
                'size_bytes' => $sizeBytes !== false ? $sizeBytes : 0,
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            $project = project_find_by_uuid_for_owner($newUuid, $ownerId);
            if ($project === null) {
                json_error('Failed to create project', 500);
            }

            write_project_meta_file($storageDir, $project);

            json_success([
                'uuid' => $project['uuid'],
                'name' => $project['name'],
                'modified' => $project['updated_at'],
            ]);
        }

        $dataFile = project_data_path($storageDir, (string)$project['storage_key']);
        $projectDir = project_dir_path($storageDir, (string)$project['storage_key']);
        if (!is_dir($projectDir)) {
            mkdir($projectDir, 0755, true);
        }

        file_put_contents($dataFile, $jsonData);
        $sizeBytes = filesize($dataFile);

        $stmt = db()->prepare(
            'UPDATE projects
             SET name = :name, size_bytes = :size_bytes, updated_at = :updated_at
             WHERE id = :id'
        );
        $stmt->execute([
            'name' => $name,
            'size_bytes' => $sizeBytes !== false ? $sizeBytes : 0,
            'updated_at' => $now,
            'id' => (int)$project['id'],
        ]);

        $project = project_find_by_uuid_for_owner((string)$project['uuid'], $ownerId);
        if ($project === null) {
            json_error('Failed to update project', 500);
        }

        write_project_meta_file($storageDir, $project);

        json_success([
            'uuid' => $project['uuid'],
            'name' => $project['name'],
            'modified' => $project['updated_at'],
        ]);
    }

    if ($method === 'PATCH') {
        if ($uuid === null || $uuid === '') {
            json_error('uuid required', 400);
        }

        $safeUuid = sanitize_uuid((string)$uuid);
        $project = project_find_by_uuid_for_owner($safeUuid, $ownerId);
        if ($project === null) {
            json_error('Project not found', 404);
        }

        $body = json_input();
        $name = trim((string)($body['name'] ?? ''));
        if ($name === '') {
            json_error('name is required', 400);
        }

        $now = date('Y-m-d H:i:s');
        $stmt = db()->prepare(
            'UPDATE projects
             SET name = :name, updated_at = :updated_at
             WHERE id = :id'
        );
        $stmt->execute([
            'name' => $name,
            'updated_at' => $now,
            'id' => (int)$project['id'],
        ]);

        $project = project_find_by_uuid_for_owner($safeUuid, $ownerId);
        if ($project === null) {
            json_error('Project not found', 404);
        }

        write_project_meta_file($storageDir, $project);

        json_success([
            'uuid' => $project['uuid'],
            'name' => $project['name'],
            'modified' => $project['updated_at'],
        ]);
    }

    if ($method === 'DELETE') {
        if ($uuid === null || $uuid === '') {
            json_error('uuid required', 400);
        }

        $safeUuid = sanitize_uuid((string)$uuid);
        $project = project_find_by_uuid_for_owner($safeUuid, $ownerId);
        if ($project === null) {
            json_error('Project not found', 404);
        }

        $stmt = db()->prepare(
            'UPDATE projects
             SET deleted_at = :deleted_at, updated_at = :updated_at
             WHERE id = :id'
        );
        $stmt->execute([
            'deleted_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
            'id' => (int)$project['id'],
        ]);

        json_success(['ok' => true]);
    }

    json_error('Method not allowed', 405);
} catch (PDOException $e) {
    json_error('Database error', 500);
} catch (Throwable $e) {
    json_error('Server error', 500);
}
