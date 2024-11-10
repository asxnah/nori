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
          <!-- идея в том, что по умолчанию будет created -->
          <!-- а по клику на li будут ссылки: ?tab='...' -->
          <?php
          if (empty($_GET["tab"])) {
            $base = $conn->prepare(
              "SELECT q.quiz_id, q.title, q.tag_1, q.tag_2, q.tag_3, q.cover, COUNT(ques.question_id) AS question_count 
              FROM quizes q
              LEFT JOIN questions ques ON q.quiz_id = ques.quiz_id
              WHERE q.author = ?
              GROUP BY q.quiz_id
              LIMIT 3"
            );

            $base->bind_param('i', $_SESSION["user_id"]);
            $base->execute();
            $result = $base->get_result();

            while ($row = $result->fetch_assoc()) {
              echo <<<html
              <!-- карточка -->
              <a 
                href="quiz.php?quiz_id={$row['quiz_id']}&title={$row['title']}" 
              >
                <p>{$row['question_count']}</p>
                <h3>{$row['title']}</h3>
                <p>{$row['tag_1']}</p>
                <p>{$row['tag_2']}</p>
                <p>{$row['tag_3']}</p>
              </a>
              html;
            }
          } else {
            $tab = $_GET["tab"];
            echo $tab;
          }
          ?>
          </>
        </section>
      </section>
    </main>

    <?php require_once '_footer.php'; ?>
  </body>

</html>