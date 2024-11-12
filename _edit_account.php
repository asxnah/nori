<?php
require_once '_config.php';
session_start();

$username = $_POST["username"] || "";
$name = $_POST["name"] || "";
$password_old = $_POST["password_old"];
$password_new = $_POST["password_new"];

