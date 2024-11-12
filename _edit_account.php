<?php
require_once '_config.php';
session_start();

$username = $_POST["username"] ?? "";
$name = $_POST["name"] ?? "";
$password_old = $_POST["password_old"] ?? "";
$password_new = $_POST["password_new"] ?? "";

$stmt = $conn->prepare("SELECT password FROM users WHERE user_id = ?");
$stmt->bind_param("i", $_SESSION["user_id"]);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

$user = $result->fetch_assoc();
$db_password = $user["password"];

if (password_verify($password_old, $db_password)) {
  $hashed_new_password = password_hash($password_new, PASSWORD_DEFAULT);

  $stmt = $conn->prepare("UPDATE users SET password = ? WHERE user_id = ?");
  $stmt->bind_param("si", $hashed_new_password, $_SESSION["user_id"]);
  $stmt->execute();
  $stmt->close();

  echo "Пароль изменён.";
} else {
  echo "Старый пароль введён неверно.";
}