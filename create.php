<!DOCTYPE html>
<html lang="en">

  <head>
    <?php require_once '_head.php'; ?>
  </head>

  <body>
    <?php
    require_once '_header.php';

    // session_start(); есть в header
    if (!isset($_SESSION["user_id"])) {
      header("Location: auth.php");
    }
    ?>

    <main></main>

    <?php require_once '_footer.php'; ?>
  </body>

</html>