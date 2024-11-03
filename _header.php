<header id="header-pc">
  <a href="index.php"><img src="./assets/logo.png" alt="логотип nori"></a>
  <nav>
    <ul>
      <li>
        <a href="./create.php" class="btn-light"
          title="Создать викторину">Создать</a>
      </li>
      <?php
      if (empty($_SESSION["user_id"])) {
        echo <<<HTML
        <li>
          <a href="./auth.php" class="btn-accent" title="Войти или зарегистрироваться">Войти</a>
        </li>
        HTML;
      } else {
        echo <<<HTML
        <li>
          <a href="./user.php" title="Перейти в профиль">&#x1F464;</a>
        </li>
        HTML;
      }
      ?>
    </ul>
  </nav>
</header>