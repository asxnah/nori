<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Nori — создавайте, настраивайте и проходите викторины онлайн</title>
<link rel="shortcut icon" href="./assets/logo-short.png" type="image/x-icon">
<link rel="stylesheet" href="./css/main.css">
<link rel="stylesheet"
  href="./css/<?php echo pathinfo(basename($_SERVER["PHP_SELF"]), PATHINFO_FILENAME); ?>.css">
<script src="scripts/main.js" defer></script>
<?php
$file_title = basename($_SERVER["PHP_SELF"], ".php");

if (
  ($file_title == "index")
  || ($file_title == "quiz")
  || ($file_title == "user")
) {
  echo <<<html
  <script src="scripts/{$file_title}.js" defer></script>
  html;
}
;
?>