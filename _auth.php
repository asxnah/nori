<?php
require_once '_config.php';
session_start();

function is_valid_username($username)
{
  return preg_match('/^[a-zA-Z0-9_]+$/', $username);
}

function is_valid_password($password)
{
  // содержит ли пароль хотя бы одну строчную, прописную букву, цифру и спецсимвол
  return preg_match('/[a-z]/', $password) && // строчные буквы
    preg_match('/[A-Z]/', $password) && // прописные буквы
    preg_match('/[0-9]/', $password) && // цифры
    preg_match('/[\W_]/', $password);   // специальные символы
}

// вход
if (isset($_POST['login'])) {
  $username = htmlspecialchars($_POST['username']);
  $password = htmlspecialchars($_POST['password']);

  if (!is_valid_username($username)) {
    echo "Логин может содержать только латинские буквы, цифры и нижнее подчеркивание (_)";
    exit();
  }

  $stmt = $conn->prepare('SELECT * FROM users WHERE username = ?');
  $stmt->bind_param('s', $username);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
      $_SESSION['user_id'] = $user['user_id'];
      header('Location: user.php');
      exit();
    } else {
      echo "Неверное имя пользователя или пароль";
    }
  } else {
    echo "Пользователь не найден";
  }
}

// регистрация
if (isset($_POST['register'])) {
  $username = htmlspecialchars($_POST['username']);
  $password = htmlspecialchars($_POST['password']);

  if (!is_valid_username($username)) {
    echo "Логин может содержать только латинские буквы, цифры и нижнее подчеркивание (_)";
    exit();
  }

  if (!is_valid_password($password)) {
    echo "Пароль должен содержать строчные и прописные буквы, минимум один специальный символ и минимум одну цифру";
    exit();
  }

  $stmt = $conn->prepare('SELECT * FROM users WHERE username = ?');
  $stmt->bind_param('s', $username);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows > 0) {
    echo "Имя пользователя занято";
    exit();
  }

  $hashed_password = password_hash($password, PASSWORD_BCRYPT);

  $stmt = $conn->prepare('INSERT INTO users (username, name, password) VALUES (?, ?, ?)');
  $stmt->bind_param('sss', $username, $username, $hashed_password);

  if ($stmt->execute()) {
    $_SESSION['user_id'] = $stmt->insert_id;
    header('Location: user.php');
    exit();
  } else {
    echo "Ошибка регистрации";
  }
}

// Выход
if (isset($_POST['logout'])) {
  session_destroy();
  header("Location: index.php");
  exit();
}