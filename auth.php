<!DOCTYPE html>
<html lang="en">

  <head>
    <?php require_once '_head.php'; ?>
  </head>

  <body>
    <?php require_once '_header.php'; ?>

    <main>
      <div id="heading">
        <img src="./assets/logo-white.png" alt="логотип nori">
        <p>Создавайте, настраивайте и проходите викторины онлайн</p>
      </div>
      <form method="post" action="_auth.php" id="auth" class="card-ts">
        <h1>Вход и регистрация</h1>
        <div class="group">
          <div class="input">
            <label for="username" hidden></label>
            <input type="text" id="username" name="username" placeholder="Логин">
          </div>
          <div class="input">
            <label for="password" hidden></label>
            <input type="password" id="password" name="password"
              placeholder="Пароль">
          </div>
        </div>
        <div id="info">
          <p>Логин может содержать:</p>
          <ul>
            <li>строчные и прописные латинские буквы</li>
            <li>цифры</li>
            <li>нижнее подчеркивание (_)</li>
          </ul>
          <br>
          <p>Пароль должен содержать:</p>
          <ul>
            <li>строчные и прописные латинские буквы</li>
            <li>минимум один (1) специальный символ</li>
            <li>минимум одну (1) цифру</li>
          </ul>
        </div>
        <div id="btns">
          <button name="login" class="btn-ts">Войти</button>
          <button name="register" class="btn-black">Зарегистрироваться</button>
        </div>
        <small>
          Регистрируясь, Вы соглашаетесь с нашими
          <a href="about">политикой конфиденциальности и условиями предоставления
            услуг</a>.
        </small>
      </form>
    </main>

    <?php require_once '_footer.php'; ?>
  </body>

</html>