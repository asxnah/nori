<?php
require_once "_config.php";
session_start();

if (isset($_GET["query"])) {
  $query = "%" . $conn->real_escape_string($_GET["query"]) . "%";

  $stmt = $conn->prepare(
    "SELECT q.quiz_id, q.title, q.tag_1, q.tag_2, q.tag_3, q.cover, COUNT(ques.question_id) AS question_count 
        FROM quizes q
        LEFT JOIN questions ques ON q.quiz_id = ques.quiz_id
        WHERE q.title LIKE ? OR q.tag_1 LIKE ? OR q.tag_2 LIKE ? OR q.tag_3 LIKE ?
        GROUP BY q.quiz_id"
  );
  $stmt->bind_param("ssss", $query, $query, $query, $query);
  $stmt->execute();
  $result = $stmt->get_result();

  $quizes = [];
  while ($row = $result->fetch_assoc()) {
    $quizes[] = $row;
  }

  echo json_encode($quizes);
}