<?php
declare(strict_types=1);

session_start();

const USERS_FILE = __DIR__ . '/data/users.json';

function isLoggedIn(): bool
{
    return isset($_SESSION['user_id']) && is_numeric($_SESSION['user_id']);
}

function requireLogin(): void
{
    if (!isLoggedIn()) {
        header('Location: login.php');
        exit;
    }
}

function ensureStorage(): void
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    if (!file_exists(USERS_FILE)) {
        file_put_contents(USERS_FILE, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}

function loadUsers(): array
{
    ensureStorage();
    $raw = file_get_contents(USERS_FILE);
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function saveUsers(array $users): void
{
    ensureStorage();
    file_put_contents(USERS_FILE, json_encode(array_values($users), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function findUserByEmail(string $email): ?array
{
    $users = loadUsers();
    foreach ($users as $user) {
        if (($user['email'] ?? '') === $email) {
            return $user;
        }
    }
    return null;
}

function findUserById(int $id): ?array
{
    $users = loadUsers();
    foreach ($users as $user) {
        if ((int)($user['id'] ?? 0) === $id) {
            return $user;
        }
    }
    return null;
}

function nextUserId(array $users): int
{
    $max = 0;
    foreach ($users as $user) {
        $currentId = (int)($user['id'] ?? 0);
        if ($currentId > $max) {
            $max = $currentId;
        }
    }
    return $max + 1;
}

function updateUserById(int $id, array $fields): void
{
    $users = loadUsers();
    foreach ($users as $index => $user) {
        if ((int)($user['id'] ?? 0) === $id) {
            $users[$index] = array_merge($user, $fields);
            break;
        }
    }
    saveUsers($users);
}
