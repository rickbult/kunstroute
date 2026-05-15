<?php
declare(strict_types=1);
require_once __DIR__ . '/config.php';

$errors = [];
$success = '';
$fullName = '';
$email = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $fullName = trim((string)($_POST['full_name'] ?? ''));
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');
    $termsAccepted = isset($_POST['accept_terms']) && $_POST['accept_terms'] === '1';

    if ($fullName === '') {
        $errors[] = 'Naam is verplicht.';
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Voer een geldig e-mailadres in.';
    }
    if (mb_strlen($password) < 8) {
        $errors[] = 'Wachtwoord moet minimaal 8 tekens bevatten.';
    }
    if (!$termsAccepted) {
        $errors[] = 'Je moet akkoord gaan met de voorwaarden voor deelname.';
    }

    if (!$errors) {
        $existingUser = findUserByEmail($email);
        if ($existingUser) {
            $errors[] = 'Er bestaat al een account met dit e-mailadres.';
        } else {
            $users = loadUsers();
            $newUser = [
                'id' => nextUserId($users),
                'full_name' => $fullName,
                'email' => $email,
                'password_hash' => password_hash($password, PASSWORD_DEFAULT),
                'accepted_terms' => 1,
                'accepted_terms_at' => date('Y-m-d H:i:s'),
                'artwork_image' => null,
                'created_at' => date('Y-m-d H:i:s'),
            ];
            $users[] = $newUser;
            saveUsers($users);
            $_SESSION['user_id'] = (int)$newUser['id'];
            $_SESSION['user_name'] = (string)$newUser['full_name'];
            $success = 'Registratie gelukt. Je bent nu ingelogd en kunt je profiel beheren.';
            $fullName = '';
            $email = '';
        }
    }
}
?>
<!doctype html>
<html lang="nl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Registreren | Kunstroute</title>
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
<main class="container">
    <section class="card" aria-labelledby="register-title">
        <h1 id="register-title">Registreren voor Kunstroute Noordwest Veluwe</h1>

        <?php if ($errors): ?>
            <div class="alert alert-error" role="alert">
                <?= htmlspecialchars(implode(' ', $errors), ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="alert alert-success" role="status">
                <?= htmlspecialchars($success, ENT_QUOTES, 'UTF-8') ?>
            </div>
        <?php endif; ?>

        <form method="post" action="" novalidate>
            <label for="full_name">Volledige naam</label>
            <input id="full_name" name="full_name" type="text" value="<?= htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') ?>" required>

            <label for="email">E-mailadres</label>
            <input id="email" name="email" type="email" value="<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>" required>

            <label for="password">Wachtwoord (minimaal 8 tekens)</label>
            <input id="password" name="password" type="password" required>

            <div class="terms-box" id="voorwaarden" aria-label="Voorwaarden voor deelname">
                <h3>Voorwaarden voor deelname aan de kunstroute Noordwest Veluwe</h3>
                <p><strong>Professionaliteit:</strong> Je bent op een professionele manier werkzaam als kunstenaar en je kunt voldoende werk tonen.</p>
                <p><strong>Atelier:</strong> Je atelier/expositieruimte ligt binnen de gemeenten Oldebroek, Elburg, Nunspeet, Harderwijk, Ermelo en Putten, is goed bereikbaar, heeft een professionele uitstraling en is geschikt om bezoekers te ontvangen of je exposeert bij een collega kunstenaar in één van genoemde gemeenten.</p>
                <p>Indien er één of meerdere kunstenaars mee willen doen in jouw atelier, moeten zij zich ook aanmelden. Kunstwerken van niet-deelnemers zijn niet toegestaan in je atelier.</p>
                <p>Je ontvangt bezoekers, geeft indien mogelijk demonstraties en houdt bezoekersregistratie bij voor het jaarverslag.</p>
                <p><strong>Ballotage:</strong> Bij nieuwe deelnemers en bij deelnemers na een onderbreking van 3 jaar of meer vindt ballotage plaats. De commissie beoordeelt techniek, zeggingskracht, beeldtaal, originaliteit, ambitie en toegankelijkheid van het atelier.</p>
                <p><strong>Privacy:</strong> Je geeft toestemming voor opslag van relevante persoonsgegevens en voor plaatsing van identificeerbare foto’s op website of social media.</p>
                <p><strong>Inschrijfgeld:</strong> € 100,–.</p>
                <p><strong>Boekje en foto’s:</strong> Per deelnemer en galerie wordt één foto vermeld op de site en in het boekje. De foto moet van goede kwaliteit zijn.</p>
                <p><strong>Publiciteit en herkenningsmiddelen:</strong> Je draagt actief bij aan verspreiding van flyers/posters/boekjes en promotie via social media.</p>
                <p><strong>Openingsavond:</strong> Aanwezigheid wordt verwacht. Bij verhindering regel je overdracht met een andere deelnemer.</p>
                <p><strong>Evaluatie:</strong> Na afloop vul je het evaluatieformulier in.</p>
            </div>

            <div class="checkbox-row">
                <input id="accept_terms" name="accept_terms" type="checkbox" value="1" required>
                <label for="accept_terms">Ik ga akkoord met de Voorwaarden voor deelname aan de kunstroute Noordwest Veluwe.</label>
            </div>

            <button class="btn" type="submit">Account aanmaken</button>
        </form>
    </section>
</main>
</body>
</html>
