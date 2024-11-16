document.addEventListener('DOMContentLoaded', () => {
	let inputs = document.querySelectorAll('.answer');

	// выделение цветом нужного ответа
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
			});
		}
	});
});
