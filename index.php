<!DOCTYPE html>
<html lang="en">

	<head>
		<?php require_once '_head.php'; ?>
	</head>

	<body>
		<?php require_once '_header.php'; ?>

		<main>
			<section id="intro">
				<div id="heading">
					<img src="./assets/logo-white.png" alt="логотип nori">
					<p>Создавайте, настраивайте и проходите викторины онлайн</p>
					<div class="group">
						<a href="./create.php" class="btn-ts">Создать</a>
						<button id="take-quiz" class="btn-black">Пройти</button>
					</div>
				</div>
				<div id="how-to" class="card-ts">
					<h2>Как это происходит?</h2>
					<p>
						Создай викторину — загрузи свои вопросы и выбери параметры игры.
						<br>
						<br>
						<span>ИЛИ</span>
						<br>
						<br>
						Пройди викторину — оцени свои знания и получи результаты сразу после
						завершения.
					</p>
					<button id="hide-banner" class="btn-ts">Понятно, спасибо!</button>
				</div>
			</section>

			<section id="quizes-con">
				<!-- поиск по викторинам -->
				<div id="searchbar">
					<input id="query" type="text" placeholder="JavaScript">
					<button id="search">
						<img src="./assets/search.png" alt="Найти 🔎">
					</button>
					<label for="search" hidden></label>
				</div>
				<!-- викторины -->
				<div id="quizes" aria-label="список викторин">
					<?php
					require_once '_config.php';

					// основной запрос для получения данных о викторинах и кол-ва вопросов
					$base = $conn->prepare(
						'SELECT q.quiz_id, q.title, q.tag_1, q.tag_2, q.tag_3, q.cover, COUNT(ques.question_id) AS question_count 
						FROM quizes q
						LEFT JOIN questions ques ON q.quiz_id = ques.quiz_id
						GROUP BY q.quiz_id
						LIMIT 3'
					);
					$base->execute();
					$result = $base->get_result();

					while ($row = $result->fetch_assoc()) {
						// открытие карточки
						echo <<<html
						<!-- карточка -->
						<a 
							href="quiz.php?quiz_id={$row['quiz_id']}&title={$row['title']}" 
							class="card-quiz" 
							aria-label="открыть викторину"
						html;

						// если есть обложка, добавляем стили
						if (!is_null($row['cover'])) {
							echo <<<html
							style="
								background: linear-gradient(
									to left,
									rgba(50, 50, 50, 0.6) 0%,
									rgba(50, 50, 50, 0.6) 100%
								),
								url('./assets/{$row['cover']}'); 
								background-size: cover; 
								background-position: center;
							"
							html;
						}

						// выводим данные карточки
						echo <<<html
						>
							<header>
								<p class="question-count" aria-label="количество вопросов викторины">
									{$row['question_count']}
								</p>
								<img src="./assets/arrow.png"
									alt="стрелка, обозначающая открытие ссылки"
									aria-label="открыть викторину">
							</header>
							<h3>{$row['title']}</h3>
							<footer aria-label="теги викторины">
								<p>{$row['tag_1']}</p>
								<p>{$row['tag_2']}</p>
								<p>{$row['tag_3']}</p>
							</footer>
						</a>
						html;
					}
					?>
				</div>
			</section>
		</main>

		<?php require_once '_footer.php'; ?>
	</body>

</html>