// реализовать поиск по викторинам

// localStorage.setItem(`banner_hidden`, `no`); // убрать

if (localStorage.getItem(`banner_hidden`) === `yes`) {
	// скрыть баннер если уже нажималась кнопка `понятно, спасибо!`
	document.querySelector(`#intro`).remove();
} else {
	// скролл к контейнеру викторин на кнопку `пройти`
	document.querySelector(`#take-quiz`).addEventListener(`click`, () => {
		window.scrollTo({
			top: document.querySelector(`#intro`).offsetHeight,
			behavior: `smooth`,
		});
	});

	// спрятать баннер-интро на кнопку `понятно, спасибо!`
	document.querySelector(`#hide-banner`).addEventListener(`click`, () => {
		// скролл до контейнера с викторинами
		window.scrollTo({
			top: document.querySelector(`#intro`).offsetHeight,
			behavior: `smooth`,
		});

		// удаление баннера
		setTimeout(() => {
			document.querySelector(`#intro`).remove();
		}, 500); // +- .5сек затрачивается на smooth скролл

		// чтобы не появлялся при перезагрузке
		localStorage.setItem(`banner_hidden`, `yes`);
	});
}

// выделение поля ввода при нажатии
document.querySelector(`#query`).addEventListener(`focus`, () => {
	document.querySelector(`#searchbar`).style.borderColor = `var(--color-main)`;
});

// снятие выделения соответственно
document.querySelector(`#query`).addEventListener(`blur`, () => {
	document.querySelector(`#searchbar`).style.borderColor = `var(--gray)`;
});

// поиск
document.addEventListener('DOMContentLoaded', () => {
	let queryInput = document.getElementById(`query`);
	let searchButton = document.getElementById(`search`);
	let quizesContainer = document.getElementById(`quizes`);
	let searchInterval;

	// Функция для выполнения AJAX-запроса
	function performSearch() {
		let query = queryInput.value.trim();
		if (query === ``) return;

		fetch(`_search_quizes.php?query=${encodeURIComponent(query)}`)
			.then((response) => response.json())
			.then((data) => {
				quizesContainer.innerHTML = ``;
				data.forEach((quiz) => {
					let quizCard = document.createElement(`a`);
					quizCard.href = `quiz.php?quiz_id=${quiz.quiz_id}&title=${quiz.title}`;
					quizCard.classList.add(`card-quiz`);
					quizCard.setAttribute(`aria-label`, `открыть викторину`);

					// Если есть обложка, добавляем стили
					if (quiz.cover) {
						quizCard.style.background = `
                            linear-gradient(to left, rgba(50, 50, 50, 0.6) 0%, rgba(50, 50, 50, 0.6) 100%),
                            url('./assets/${quiz.cover}')
                        `;
						quizCard.style.backgroundSize = `cover`;
						quizCard.style.backgroundPosition = `center`;
					}

					quizCard.innerHTML = `
                        <header>
                            <p class="question-count" aria-label="количество вопросов викторины">
                                ${quiz.question_count}
                            </p>
                            <img src="./assets/arrow.png" alt="стрелка, обозначающая открытие ссылки" aria-label="открыть викторину">
                        </header>
                        <h3>${quiz.title}</h3>
                        <footer aria-label="теги викторины">
                            <p>${quiz.tag_1 || ''}</p>
                            <p>${quiz.tag_2 || ''}</p>
                            <p>${quiz.tag_3 || ''}</p>
                        </footer>
                    `;
					quizesContainer.appendChild(quizCard);
				});
			})
			.catch((error) =>
				console.error(`Ошибка при выполнении поиска: ${error}`)
			);
	}

	// Запускаем поиск каждые 5 секунд, если поле активно и не пусто
	queryInput.addEventListener(`focus`, () => {
		searchInterval = setInterval(() => {
			if (queryInput.value.trim() !== ``) {
				performSearch();
			}
		}, 5000);
	});

	// Очищаем интервал, когда поле теряет фокус
	queryInput.addEventListener(`blur`, () => {
		clearInterval(searchInterval);
	});

	// Поиск по нажатию Enter
	queryInput.addEventListener(`keypress`, (e) => {
		if (e.key === `Enter` && queryInput.value.trim() !== ``) {
			performSearch();
		}
	});

	// Поиск при клике на кнопку поиска
	searchButton.addEventListener(`click`, () => {
		if (queryInput.value.trim() !== ``) {
			performSearch();
		}
	});
});
