<?php

$srv = 'localhost';
$user = 'root';
$db = 'nori';
$psw = '';

$conn = new mysqli($srv, $user, $psw, $db);

if ($conn->connect_error) {
  die('ошибка подключения >> ' . $conn->connect_error);
}