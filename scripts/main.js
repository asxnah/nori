// —————————— *.PHP ——————————

// скролл вверх станицы любой из подвала
document.querySelector(`footer #up`).addEventListener(`click`, () => {
	document.body.scrollIntoView({
		behavior: `smooth`,
	});
});

// —————————— INDEX.PHP ——————————

// реализовать поиск по викторинам
// добавить анимацию скрытия баннера
localStorage.setItem(`banner_hidden`, `no`);

if (window.location.pathname.includes('index.php')) {
	if (localStorage.getItem(`banner_hidden`) === `yes`) {
		// скрыть баннер если уже нажималась кнопка "понятно, спасибо!"
		document.querySelector(`#intro`).remove();
	} else {
		// кнопка "пройти" —> скролл к контейнеру викторин
		document.querySelector(`#take-quiz`).addEventListener(`click`, () => {
			document.querySelector(`#quizes-con`).scrollIntoView({
				behavior: `smooth`,
				block: 'start',
			});
		});

		// кнопка "понятно, спасибо!" —> спрятать баннер-интро
		document.querySelector(`#hide-banner`).addEventListener(`click`, () => {
			document.querySelector(`#intro`).remove();
			localStorage.setItem(`banner_hidden`, `yes`);
		});
	}

	// выделение поля ввода при нажатии
	document.querySelector(`#query`).addEventListener(`focus`, () => {
		document.querySelector(
			`#searchbar`
		).style.borderColor = `var(--color-main)`;
	});

	// снятие выделения соответственно
	document.querySelector(`#query`).addEventListener(`blur`, () => {
		document.querySelector(`#searchbar`).style.borderColor = `var(--gray)`;
	});
}

// —————————— QUIZ.PHP ——————————

// добавить сохранение в localstorage
// добавить функционал кнопке "подробнее"

if (window.location.pathname.includes('quiz.php')) {
	document.addEventListener('DOMContentLoaded', () => {
		const totalQuestions = document.querySelectorAll('.question-con').length;
		const completedElement = document.getElementById('completed');
		const inputs = document.querySelectorAll('.answer');

		function updateProgress() {
			let answeredQuestions = Array.from(inputs).filter(
				(input) =>
					(input.type === 'radio' && input.checked) ||
					(input.tagName === 'TEXTAREA' && input.value.trim() !== '')
			).length;

			const progress = Math.floor((answeredQuestions / totalQuestions) * 100);
			completedElement.textContent = Math.max(0, Math.min(progress, 100));
		}

		inputs.forEach((input) => {
			if (input.type === 'radio') {
				input.addEventListener('change', updateProgress);
			} else if (input.tagName === 'TEXTAREA') {
				input.addEventListener('input', updateProgress);
			}
		});

		updateProgress();
	});
}
