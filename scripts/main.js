// —————————— *.PHP ——————————

// скролл вверх станицы любой из подвала
document.querySelector(`footer #up`).addEventListener(`click`, () => {
	document.body.scrollIntoView({
		behavior: `smooth`,
	});
});

// —————————— INDEX.PHP ——————————

// реализовать поиск по викторинам
localStorage.setItem(`banner_hidden`, `no`);

if (window.location.pathname.includes(`index.php`)) {
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
			window.scrollTo({
				top: document.querySelector(`#intro`).offsetHeight,
				behavior: `smooth`,
			});
			setTimeout(() => {
				document.querySelector(`#intro`).remove();
			}, 1000);
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
// добавить функционал кнопке `подробнее`

if (window.location.pathname.includes(`quiz.php`)) {
	document.addEventListener(`DOMContentLoaded`, () => {
		let totalQuestions = document.querySelectorAll(`.question-con`).length;
		let completedElement = document.querySelector(`#completed`);
		let inputs = document.querySelectorAll(`.answer`);

		function updateProgress() {
			let answeredQuestions = Array.from(inputs).filter(
				(input) =>
					(input.type === `radio` && input.checked) ||
					(input.tagName === `TEXTAREA` && input.value.trim() !== ``)
			).length;

			let progress = Math.floor((answeredQuestions / totalQuestions) * 100);
			completedElement.textContent =
				Math.max(0, Math.min(progress, 100)) || `0`; // чтобы NaN не возвращал
		}

		inputs.forEach((input) => {
			if (input.type === `radio`) {
				input.addEventListener(`change`, updateProgress);
			} else if (input.tagName === `TEXTAREA`) {
				input.addEventListener(`input`, updateProgress);
			}
		});

		updateProgress();
	});
}
