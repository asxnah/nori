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

    <main>
      <section id="info">
        <section id="heading">
          <div id="name"><?php
          $stmt = $conn->prepare("SELECT username, name FROM users WHERE user_id = ?");
          $stmt->bind_param('i', $_SESSION["user_id"]);
          $stmt->execute();
          $result = $stmt->get_result();

          while ($user = $result->fetch_assoc()) {
            echo <<<html
            <p aria-label="Логин">{$user["username"]}</p>
            <h1 aria-label="Имя">{$user["name"]}</h1>
            html;
          }

          $stmt->close();
          ?></div>
          <button id="edit"
            aria-label="Редактировать данные аккаунта">✏️</button>
        </section>
        <hr />
        <h3>Статистика</h3>
        <section id="stats">
          <div class="group">
            <p>Пройдено</p>
            <hr />
            <p><?php
            $stmt = $conn->prepare("SELECT COUNT(DISTINCT q.quiz_id) AS quizes_completed FROM user_answers ua JOIN questions q ON ua.question_id = q.question_id WHERE ua.user_id = ?");
            $stmt->bind_param('i', $_SESSION["user_id"]);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($completed = $result->fetch_assoc()) {
              echo $completed['quizes_completed'];
            }

            $stmt->close();
            ?></p>
          </div>
          <div class="group"></div>
          <p>Создано</p>
          <hr />
          <p><?php
          $stmt = $conn->prepare("SELECT COUNT(*) AS quizes_created FROM quizes WHERE author = ?");
          $stmt->bind_param('i', $_SESSION["user_id"]);
          $stmt->execute();
          $result = $stmt->get_result();

          if ($user = $result->fetch_assoc()) {
            echo $user['quizes_created'];
          }

          $stmt->close();
          ?></p>
        </section>
        <hr />
        <form action="_auth.php" method="post">
          <button name="logout">Выйти из аккаунта</button>
        </form>
      </section>

      <section id="quizes">
        <menu>
          <ul id="tabs">
            <li id="tab-created" class="active">Созданные</li>
            <li id="tab-finished">Пройденные</li>
          </ul>
          <hr />
          <a href="./create.php" class="btn-black">
            <img src="./assets/plus.svg" alt="+ (Создать викторину)">
            Создать
          </a>
        </menu>
        <section id="quiz-list">
          <!-- список викторин через fetch js -->
        </section>
      </section>
    </main>

    <?php require_once '_footer.php'; ?>
  </body>

</html>