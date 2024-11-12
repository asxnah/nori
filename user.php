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
            <p aria-label="Логин" id="label-username">@{$user["username"]}</p>
            <h1 aria-label="Имя" id="label-name">{$user["name"]}</h1>
            html;
          }

          $stmt->close();
          ?></div>
          <button id="edit"
            aria-label="Редактировать данные аккаунта">
            <img src="./assets/pencil-purple.png" alt="икнока карандаша">
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
            $stmt = $conn->prepare("SELECT q.quiz_id, q.title, q.tag_1, q.tag_2, q.tag_3, q.cover, COUNT(ques.question_id) AS question_count 
            FROM quizes q
            LEFT JOIN questions ques ON q.quiz_id = ques.quiz_id
            WHERE q.author = ?
            GROUP BY q.quiz_id
            LIMIT 3");
            $stmt->bind_param('i', $_SESSION["user_id"]);
            $stmt->execute();
            $result = $stmt->get_result();
            while ($quiz = $result->fetch_assoc()) {
              // открытие карточки
              echo <<<html
              <!-- карточка -->
              <a 
                href="quiz.php?quiz_id={$quiz['quiz_id']}&title={$quiz['title']}" 
                class="card-quiz" 
                aria-label="открыть викторину"
              html;

              // если есть обложка, добавляем стили
              if (!is_null($quiz['cover'])) {
                echo <<<html
                style="
                  background: linear-gradient(
                    to left,
                    rgba(50, 50, 50, 0.6) 0%,
                    rgba(50, 50, 50, 0.6) 100%
                  ),
                  url('./assets/{$quiz['cover']}'); 
                  background-size: cover; 
                  background-position: center;
                "
                html;
              }

              // выводим данные карточки
              echo <<<html
              >
                <header>
                  <p class="question-count" aria-label="количество вопросов викторины">
                    {$quiz['question_count']}
                  </p>
                  <img 
                    src="./assets/pencil-white.png" 
                    alt="икнока карандаша" 
                    aria-label="редактировать созданную викторину"
                  >
                </header>
                <h3>{$quiz['title']}</h3>
                <footer aria-label="теги викторины">
                  <p>{$quiz['tag_1']}</p>
                  <p>{$quiz['tag_2']}</p>
                  <p>{$quiz['tag_3']}</p>
                </footer>
                <div class="group">
                  <button class="btn-ts">
                    <span>Скачать</span>
                    <span class="filetype">DOCX</span>
                  </button>
                  <button class="btn-black">Удалить</button>
                </div>
              </a>
              html;
            }

            $stmt->close();
          } else {
            $tab = $_GET["tab"];
            // вывести викторины в зависимости от $tab (created или finished)
            switch ($tab) {
              case 'created':
                $stmt = $conn->prepare("SELECT q.quiz_id, q.title, q.tag_1, q.tag_2, q.tag_3, q.cover, COUNT(ques.question_id) AS question_count 
                FROM quizes q
                LEFT JOIN questions ques ON q.quiz_id = ques.quiz_id
                WHERE q.author = ?
                GROUP BY q.quiz_id
                LIMIT 3");
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
                // открытие карточки
                echo <<<html
              <!-- карточка -->
              <a 
                href="quiz.php?quiz_id={$quiz['quiz_id']}&title={$quiz['title']}" 
                class="card-quiz" 
                aria-label="открыть викторину"
              html;

                // если есть обложка, добавляем стили
                if (!is_null($quiz['cover'])) {
                  echo <<<html
                style="
                  background: linear-gradient(
                    to left,
                    rgba(50, 50, 50, 0.6) 0%,
                    rgba(50, 50, 50, 0.6) 100%
                  ),
                  url('./assets/{$quiz['cover']}'); 
                  background-size: cover; 
                  background-position: center;
                "
                html;
                }

                // выводим данные карточки
                echo <<<html
              >
                <header>
                  <p class="question-count" aria-label="количество вопросов викторины">
                    {$quiz['question_count']}
                  </p>
                  <img 
                    src="./assets/pencil-white.png" 
                    alt="икнока карандаша" 
                    aria-label="редактировать созданную викторину"
                  >
                </header>
                <h3>{$quiz['title']}</h3>
                <footer aria-label="теги викторины">
                  <p>{$quiz['tag_1']}</p>
                  <p>{$quiz['tag_2']}</p>
                  <p>{$quiz['tag_3']}</p>
                </footer>
                <div class="group">
                  <button class="btn-ts">
                    <span>Скачать</span>
                    <span class="filetype">DOCX</span>
                  </button>
                  <button class="btn-black">Удалить</button>
                </div>
              </a>
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