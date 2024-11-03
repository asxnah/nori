<?php
session_start();
require_once '_config.php';

$user_id = $_SESSION['user_id'];
$quiz_id = (int) $_POST['quiz_id'];
$answers = $_POST['answers'] ?? [];

foreach ($answers as $question_id => $user_answer) {
  $stmt = $conn->prepare("
        INSERT INTO user_answers (question_id, user_id, selected_answer_id, open_text_answer) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE selected_answer_id = VALUES(selected_answer_id), open_text_answer = VALUES(open_text_answer)
    ");
  $selected_answer_id = null;
  $open_text_answer = '';

  if (is_array($user_answer)) { // multiple_choice
    $selected_answer_id = (int) $user_answer['selected_answer_id'];
  } else if ($user_answer === 'true' || $user_answer === 'false') { // true_false
    $open_text_answer = $user_answer;
  } else { // open_text
    $open_text_answer = trim($user_answer);
  }

  $stmt->bind_param('iiis', $question_id, $user_id, $selected_answer_id, $open_text_answer);
  $stmt->execute();
}

header("Location: result.php?quiz_id={$quiz_id}");
exit;