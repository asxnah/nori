document.addEventListener('DOMContentLoaded', () => {
	let totalQuestions = document.querySelectorAll('.question-con').length;
	let completedElement = document.querySelector('#completed');
	let inputs = document.querySelectorAll('.answer');

	function updateProgress() {
		let answeredQuestions = Array.from(inputs).filter(
			(input) =>
				(input.type === 'radio' && input.checked) ||
				(input.tagName === 'TEXTAREA' && input.value.trim() !== '')
		).length;

		let progress = Math.floor((answeredQuestions / totalQuestions) * 100);
		completedElement.textContent = Math.max(0, Math.min(progress, 100)) || '0';
	}

	// выделение цветом нужного ответа и обновление % прогресса
	inputs.forEach((input) => {
		if (input.type === 'radio') {
			input.addEventListener('change', (event) => {
				const currentGroup = event.target
					.closest('.answers')
					.querySelectorAll('.answer');

				currentGroup.forEach((radio) => {
					const label = radio.nextElementSibling;
					if (label) {
						label.classList.remove('btn-accent');
						label.classList.add('btn-black');
					}
				});

				const selectedLabel = input.nextElementSibling;
				if (selectedLabel) {
					selectedLabel.classList.remove('btn-black');
					selectedLabel.classList.add('btn-accent');
				}

				updateProgress();
			});
		} else if (input.tagName === 'TEXTAREA') {
			input.addEventListener('input', updateProgress);
		}
	});

	updateProgress();
});

// показать информацию о викторине на кнопку `подробнее`
document.querySelector(`#show-detailed`).addEventListener(`click`, () => {
	document.querySelector(`#detailed`).classList.add(`shown`);
});

// скрыть информацию о викторине на кнопку X или "Понятно!"
document.querySelectorAll(`.close-detailed`).forEach((button) => {
	button.addEventListener(`click`, () => {
		document.querySelector(`#detailed`).classList.remove(`shown`);
	});
});
