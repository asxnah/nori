<!DOCTYPE html>
<html lang="en">

  <head>
    <?php require_once '_head.php'; ?>
  </head>

  <body>
    <?php require_once '_header.php'; ?>

    <main>
      <form action="_auth.php" method="post">
        <button name="logout">выйти</button>
      </form>
    </main>

    <?php require_once '_footer.php'; ?>
  </body>

</html>