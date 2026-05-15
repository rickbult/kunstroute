<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';
requireLogin();

$userId = (int)$_SESSION['user_id'];
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['artwork_image'])) {
    $file = $_FILES['artwork_image'];

    if (!isset($file['error']) || is_array($file['error'])) {
        $error = 'Ongeldige upload ontvangen.';
    } elseif ($file['error'] !== UPLOAD_ERR_OK) {
        $error = 'Upload mislukt. Probeer het opnieuw.';
    } else {
        $allowedMime = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
        ];
        $maxBytes = 5 * 1024 * 1024;
        $tmpPath = (string)$file['tmp_name'];
        $fileSize = (int)$file['size'];

        $mime = mime_content_type($tmpPath) ?: '';
        if (!isset($allowedMime[$mime])) {
            $error = 'Alleen JPG, PNG of WEBP-bestanden zijn toegestaan.';
        } elseif ($fileSize > $maxBytes) {
            $error = 'Bestand is te groot. Maximaal 5 MB.';
        } else {
            $uploadDir = __DIR__ . '/uploads';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $filename = 'artwork_' . $userId . '_' . time() . '.' . $allowedMime[$mime];
            $destination = $uploadDir . '/' . $filename;

            if (!move_uploaded_file($tmpPath, $destination)) {
                $error = 'Kon het bestand niet opslaan.';
            } else {
                $dbPath = 'uploads/' . $filename;
                updateUserById($userId, ['artwork_image' => $dbPath]);
                $message = 'Afbeelding succesvol geüpload.';
            }
        }
    }
}
$user = findUserById($userId);
if (!$user) {
    $_SESSION = [];
    session_destroy();
    header('Location: login.php');
    exit;
}
?>
<!doctype html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Profiel | Kunstroute</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
<nav class="navbar" aria-label="Hoofdnavigatie">
    <strong>Kunstroute</strong>
    <div>
        <a href="profile.php">Profiel</a>
        <a href="logout.php">Uitloggen</a>
    </div>
</nav>

<main class="container">
    <section class="card" aria-labelledby="profile-title">
        <h1 id="profile-title">Mijn profiel</h1>
        <p><strong>Naam:</strong> <?= htmlspecialchars((string)$user['full_name'], ENT_QUOTES, 'UTF-8') ?></p>
        <p><strong>E-mail:</strong> <?= htmlspecialchars((string)$user['email'], ENT_QUOTES, 'UTF-8') ?></p>

        <?php if ($error): ?>
            <div class="alert alert-error" role="alert">
                <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <?php if ($message): ?>
            <div class="alert alert-success" role="status">
                <?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <h2>Upload afbeelding van je kunstwerk</h2>
        <form method="post" enctype="multipart/form-data">
            <label for="artwork_image">Kies een afbeelding (JPG, PNG of WEBP, max. 5 MB)</label>
            <input id="artwork_image" name="artwork_image" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" required>
            <button class="btn" type="submit">Afbeelding uploaden</button>
        </form>

        <?php if (!empty($user['artwork_image'])): ?>
            <div class="art-preview">
                <h3>Huidige afbeelding</h3>
                <img src="<?= htmlspecialchars((string)$user['artwork_image'], ENT_QUOTES, 'UTF-8') ?>" alt="Geüploade afbeelding van kunstwerk">
            </div>
        <?php endif; ?>
    </section>
</main>
</body>
</html>
