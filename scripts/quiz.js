// добавить сохранение в localstorage
// добавить функционал кнопке `подробнее`

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
		completedElement.textContent = Math.max(0, Math.min(progress, 100)) || `0`; // чтобы NaN не возвращал
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
