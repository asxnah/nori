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
      <form action="_create_quiz.php" method="POST">
        <section id="info">
          <div id="text-info">
            <h2>О викторине</h2>
            <div class="group">
              <label for="title" hidden></label>
              <input type="text" id="title" name="title" placeholder="Название">
              <label for="description" hidden></label>
              <textarea name="description" id="description"
                placeholder="Описание"></textarea>
              <div id="tags">
                <input type="text" id="tag-1" name="tag-1" placeholder="Тег">
                <input type="text" id="tag-2" name="tag-2" placeholder="Тег">
                <input type="text" id="tag-3" name="tag-3" placeholder="Тег">
              </div>
            </div>
          </div>
          <div id="upload" aria-label="загрузить фон викторины">
            <img src="./assets/upload.png" alt="иконка загрузки">
            <input type="file" name="cover" id="cover">
          </div>
        </section>
        <div id="heading">
          <h2>Вопросы</h2>
          <div id="actions">
            <button class="btn-black">
              <img src="./assets/plus.svg" alt="+">
              Выбор
            </button>
            <button class="btn-black">
              <img src="./assets/plus.svg" alt="+">
              Истинно / Ложно
            </button>
            <button class="btn-black">
              <img src="./assets/plus.svg" alt="+">
              Открытый вопрос
            </button>
            <div class="select">
              <img src="./assets/timer.png" alt="время на прохождение">
              <select class="btn-black">
                <option value="infinite">
                  Не ограничено
                </option>
                <option value="5">5 мин</option>
                <option value="10">10 мин</option>
                <option value="15">15 мин</option>
                <option value="20">20 мин</option>
                <option value="25">25 мин</option>
                <option value="30">30 мин</option>
                <option value="35">35 мин</option>
                <option value="40">40 мин</option>
                <option value="45">45 мин</option>
                <option value="50">50 мин</option>
                <option value="55">55 мин</option>
                <option value="60">60 мин (1 ч)</option>
                <option value="90">90 мин (1 ч 30 мин)</option>
                <option value="120">120 мин (2 ч)</option>
                <option value="235">235 мин (3 ч 55 мин)</option>
              </select>
            </div>
          </div>
        </div>
        <section id="questions">
          <div class="question-con">
            <div class="question-text">
              <!-- make count auto increment from 1 to .. (how many questions. since amount of questions can be increased) -->
              <p class="question-num">{$count}</p>
              <input type="text" id="question" name="question" placeholder="Вопрос">
            </div>
            <label for="question" hidden></label>
            <div class="answers multiple_choice">
              <div class="answer">
                <div class="toggler">
                  <!-- on click toggle between true.svg and false.svg -->
                  <!-- display true.svg if true and false.svg if false -->
                  <!-- default is false.svg -->
                  <img src="./assets/false.svg" alt="false">
                  <!-- 1 if true and 0 if false -->
                  <input type="text" hidden>
                </div>
                <input type="text" id="answer" name="answer" placeholder="Ответ">
              </div>
              <div class="answer">
                <div class="toggler">
                  <img src="./assets/false.svg" alt="false">
                  <input type="text" hidden>
                </div>
                <input type="text" id="answer" name="answer" placeholder="Ответ">
              </div>
            </div>
            <!-- add empty answer in answers div  -->
            <button class="btn-black">
              <img src="./assets/plus.svg" alt="+">
              Ответ
            </button>
          </div>
          <div class="question-con">
            <div class="question-text">
              <p class="question-num">{$count}</p>
              <input type="text" id="question" name="question" placeholder="Вопрос">
            </div>
            <label for="question" hidden></label>
            <div class="answers true_false">
              <div class="group">
                <input
                  type="radio"
                  id="true"
                  name="true"
                  class="answer"
                  value="true">
                <label for="true">
                  <img src="./assets/true.svg" alt="правда" />
                </label>
              </div>
              <div class="group">
                <input
                  type="radio"
                  id="false"
                  name="false"
                  class="answer"
                  value="false">
                <label for="false">
                  <img src="./assets/false.svg" alt="ложь" />
                </label>
              </div>
            </div>
          </div>
          <div class="question-con">
            <div class="question-text">
              <p class="question-num">{$count}</p>
              <input type="text" id="question" name="question" placeholder="Вопрос">
            </div>
            <label for="question" hidden></label>
            <div class="answers open_text">
              <textarea name="answer" id="answer" class="answer"
                placeholder="Ответ"></textarea>
            </div>
          </div>
        </section>
        <button type="submit" class="btn-accent">Создать</button>
      </form>
    </main>

    <?php require_once '_footer.php'; ?>
  </body>

</html>