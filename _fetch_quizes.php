<?php
// require_once '_config.php';
// session_start();

// header('Content-Type: application/json');
// echo ini_set('display_errors', 1);
// echo error_reporting(E_ALL);

// if ($_SERVER['REQUEST_METHOD'] === 'POST') {
//   $userId = $_POST['user_id'];
//   $quizType = $_POST['type'];

//   if ($quizType === 'created') {
//     // созданные
//     $stmt = $pdo->prepare("SELECT quiz_id, title, description, tag_1, tag_2, tag_3 FROM quizes WHERE author = ?");
//     $stmt->execute([$userId]);
//   } elseif ($quizType === 'finished') {
//     // завершенные
//     $stmt = $pdo->prepare("SELECT q.quiz_id, q.title, q.description, q.tag_1, q.tag_2, q.tag_3 FROM user_answers ua
//     JOIN questions qs ON ua.question_id = qs.question_id
//     JOIN quizes q ON qs.quiz_id = q.quiz_id
//     WHERE ua.user_id = ?
//     GROUP BY q.quiz_id");
//     $stmt->execute([$userId]);
//   }

//   // Получаем результаты
//   $quizes = $stmt->fetchAll(PDO::FETCH_ASSOC);

//   // Выводим результат
//   if (empty($quizes)) {
//     echo json_encode(['message' => 'No quizzes found']);
//   } else {
//     echo json_encode(['user_id' => $userId, 'quizes' => $quizes]);
//   }
// }
?>