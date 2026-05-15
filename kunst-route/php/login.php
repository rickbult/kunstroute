<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

if (isLoggedIn()) {
    header('Location: profile.php');
    exit;
}

$error = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');
    $user = findUserByEmail($email);

    if (!$user || !password_verify($password, (string)($user['password_hash'] ?? ''))) {
        $error = 'Onjuist e-mailadres of wachtwoord.';
    } else {
        $_SESSION['user_id'] = (int)$user['id'];
        $_SESSION['user_name'] = (string)$user['full_name'];
        header('Location: profile.php');
        exit;
    }
}
?>
<!doctype html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Inloggen | Kunstroute</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<nav class="navbar" aria-label="Hoofdnavigatie">
    <strong>Kunstroute</strong>
    <div>
        <a href="login.php">Inloggen</a>
        <a href="register.php">Registreren</a>
    </div>
</nav>

<main class="centered-container">
    <section class="card" aria-labelledby="login-title">
        <h1 id="login-title">Inloggen</h1>

        <?php if ($error): ?>
            <div class="alert alert-error" role="alert">
                <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <form method="post" action="" novalidate>
            <label for="email">E-mailadres</label>
            <input id="email" name="email" type="email" value="<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>" required>

            <label for="password">Wachtwoord</label>
            <input id="password" name="password" type="password" required>

            <button class="btn" type="submit">Inloggen</button>
        </form>
    </section>
</main>
</body>
</html>
