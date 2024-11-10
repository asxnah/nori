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
            <p aria-label="Логин">@{$user["username"]}</p>
            <h1 aria-label="Имя">{$user["name"]}</h1>
            html;
          }

          $stmt->close();
          ?></div>
          <button id="edit"
            aria-label="Редактировать данные аккаунта">
            <img src="./assets/violet-pencil.svg" alt="икнока карандаша">
          </button>
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
          <div class="group">
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
          </div>
        </section>
        <hr />
        <form action="_auth.php" method="post">
          <button name="logout" id="logout">Выйти из аккаунта</button>
        </form>
      </section>

      <section id="quizes">
        <menu>
          <ul id="tabs">
            <li id="tab-created" class="tab">
              <a href="./user.php?tab=created">Созданные</a>
            </li>
            <li id="tab-finished" class="tab">
              <a href="./user.php?tab=finished">Пройденные</a>
            </li>
          </ul>
          <hr />
          <a href="./create.php" class="btn-black">
            <img src="./assets/plus.svg" alt="+ (Создать викторину)">
            Создать
          </a>
        </menu>
        <section id="quiz-list">
          <!-- список викторин через fetch js -->
          <!-- сверстать карточки -->
          <!-- добавить функционал редактирования профиля -->
          <?php
          if (empty($_GET["tab"])) {
            // вывести созданные викторины
            $stmt = $conn->prepare("SELECT * FROM quizes WHERE author = ?");
            $stmt->bind_param('i', $_SESSION["user_id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($quiz = $result->fetch_assoc()) {
              echo "<div class='quiz'>{$quiz['title']}</div>";
            }

            $stmt->close();
          } else {
            $tab = $_GET["tab"];
            // вывести викторины в зависимости от $tab (created или finished)
            switch ($tab) {
              case 'created':
                $stmt = $conn->prepare("SELECT * FROM quizes WHERE author = ?");
                break;
              case 'finished':
                $stmt = $conn->prepare("SELECT DISTINCT q.quiz_id, q.title 
                FROM quizes q
                JOIN questions qs ON qs.quiz_id = q.quiz_id
                JOIN user_answers ua ON ua.question_id = qs.question_id
                WHERE ua.user_id = ? AND ua.selected_answer_id IS NOT NULL");
                break;
            }

            $stmt->bind_param('i', $_SESSION["user_id"]);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
              while ($quiz = $result->fetch_assoc()) {
                echo <<<html
                <div class='quiz'>{$quiz['title']}</div>
                html;
              }
            } else {
              echo <<<html
              <h3 id="alert">Ничего нет.</h3>
              html;
            }
            $stmt->close();
          }
          ?>
        </section>
      </section>
    </main>

    <?php require_once '_footer.php'; ?>
  </body>

</html>