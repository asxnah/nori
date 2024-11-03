<?php
// Подключение к базе данных
require_once "_config.php";

// quiz_id и title из параметров запроса
$title = htmlspecialchars($_GET["title"]);
$quiz_id = (int) $_GET["quiz_id"];

// вопросы викторины по quiz_id
$query = "SELECT question_id, text, type FROM questions WHERE quiz_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $quiz_id);
$stmt->execute();
$result = $stmt->get_result();

?>

<!DOCTYPE html>
<html lang="en">

  <head>
    <?php require_once "_head.php"; ?>
  </head>

  <body>
    <?php require_once "_header.php"; ?>

    <main>
      <section id="heading">
        <div id="title">
          <p><span id="completed"></span>% пройдено</p>
          <h2>
            <?php echo $title; ?>
          </h2>
        </div>
        <button id="show-more" class="btn-light">Подробнее</button>
      </section>

      <form id="quiz" method="post" action="_submit_answers.php">
        <?php
        $count = 1;
        while ($row = $result->fetch_assoc()) {
          echo <<<html
          <section class="question-con">
            <div class="question-text">
              <p class="question-num">{$count}</p>
              <p class="question">{$row["text"]}</p>
            </div>
          html;

          switch ($row["type"]) {
            case "multiple_choice":
              $question_id = $row["question_id"];
              $answer_sql = $conn->prepare("SELECT answer_id, text FROM answers WHERE question_id = ?");
              $answer_sql->bind_param("i", $question_id);
              $answer_sql->execute();
              $answer_result = $answer_sql->get_result();

              echo <<<html
              <div class="answers">
              html;

              while ($answer = $answer_result->fetch_assoc()) {
                echo <<<html
                <div class="group">
                  <input 
                    type="radio" 
                    id="answer_{$answer["answer_id"]}"
                    class="answer"
                    name="answers[{$question_id}]" 
                    value="{$answer["answer_id"]}">
                  <label for="answer_{$answer["answer_id"]}" class="btn-black">{$answer["text"]}</label>
                </div>
                html;
              }

              echo <<<html
              </div>
              html;
              break;

            case "true_false":
              echo <<<html
              <div class="answers true_false">
                <div class="group">
                  <input 
                    type="radio" 
                    id="true_{$row["question_id"]}" 
                    class="answer"
                    name="answers[{$row["question_id"]}]" 
                    value="true">
                  <label for="true_{$row["question_id"]}">
                    <img src="./assets/true.svg" alt="правда" />
                  </label>
                </div>
                <div class="group">
                  <input 
                    type="radio" 
                    id="false_{$row["question_id"]}" 
                    class="answer"
                    name="answers[{$row["question_id"]}]" 
                    value="false">
                  <label for="false_{$row["question_id"]}">
                    <img src="./assets/false.svg" alt="ложь" />
                  </label>
                </div>
              </div>
              html;
              break;

            case "open_text":
              echo <<<html
              <div class="answers">
                <textarea 
                  name="answers[{$row["question_id"]}][open]" 
                  class="answer"
                  placeholder="Ответ"></textarea>
              </div>
              html;
              break;

            default:
              echo "<p>Неизвестный тип вопроса.</p>";
              break;
          }
          echo <<<html
          </section>
          html;
          $count++;
        }
        ?>
        <button class="btn-accent" type="submit">Завершить</button>
      </form>
    </main>

    <?php require_once "_footer.php"; ?>
  </body>

</html>