// ---------- КОНТРОЛЬ МЕНЮ ДОБАВЛЕНИЯ ВОПРОСОВ ----------
document.querySelector(`#dropdown-button`).addEventListener(`click`, () => {
	document.querySelector(`#menu-questions`).classList.toggle(`show`);
});
window.addEventListener(`click`, (evt) => {
	if (!evt.target.closest(`#menu-mobile`)) {
		document.querySelector(`#menu-questions`).classList.remove(`show`);
	}
});

// ---------- ОБРАБОТКА CLICK ДЛЯ DIV С РОЛЬЮ BUTTON ----------
document.querySelectorAll(`[role="button"]`).forEach((button) => {
	button.addEventListener(`keydown`, (evt) => {
		if (evt.key === `Enter` || evt.key === ` `) {
			evt.preventDefault();
			evt.target.click();
		}
	});
});

// ---------- ПРЕВЬЮ ЗАГРУЖЕННОЙ ОБЛОЖКИ ----------
document.querySelector(`#cover`).addEventListener(`change`, function (evt) {
	let file = evt.target.files[0];
	let uploadContainer = document.querySelector(`#upload`);

	if (file) {
		let reader = new FileReader();

		reader.onload = function (e) {
			uploadContainer.classList.add(`covered`);
			uploadContainer.style.backgroundImage = `url(${e.target.result})`;
			uploadContainer.style.backgroundSize = `cover`;
			uploadContainer.style.backgroundPosition = `center`;
		};

		reader.readAsDataURL(file);
	}
});
// функция удаления фона
document.querySelector(`#remove-bg-btn`).addEventListener(`click`, function () {
	// очистка фона
	let uploadContainer = document.querySelector(`#upload`);
	uploadContainer.classList.remove(`covered`);
	uploadContainer.style.backgroundImage = ``;

	// предотвращение загрузки на сервер
	let uploadInput = document.querySelector(`#cover`);
	uploadInput.value = ``;
});

// ---------- КОНТРОЛЬ MULTIPLE-CHOICE ----------
// добавление ответа
let questions = document.querySelectorAll(`.question`);
questions.forEach((question) => {
	let answersContainer = question.querySelector(`.multiple-choice`);

	if (answersContainer) {
		let addAnswerButton = question.querySelector(`.add-answer`);
		addAnswerButton.addEventListener(`click`, () => {
			let newAnswerId = `correct-${answersContainer.children.length + 1}`;
			let newAnswerCon = document.createElement(`div`);
			newAnswerCon.classList.add(`answer-con`);

			newAnswerCon.innerHTML = `
      <label for="${newAnswerId}" class="custom-checkbox">
        <input type="checkbox" id="${newAnswerId}" name="checkbox-${newAnswerId}" value="...">
        <span class="checkmark"></span>
      </label>
      <input class="btn" placeholder="Ответ">
      <div role="button" class="delete-answer" tabindex="0">
        <svg width="16" height="16" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_310_33)">
            <rect x="0.302307" y="8.48535" width="12" height="75.5977" rx="6" transform="rotate(-45 0.302307 8.48535)" fill="#dedede"></rect>
            <rect x="53.7579" width="12" height="75.5977" rx="6" transform="rotate(45 53.7579 0)" fill="#dedede"></rect>
          </g>
          <defs>
            <clipPath id="clip0_310_33">
              <rect width="60" height="60.0001" fill="none" transform="translate(0.302307)"></rect>
            </clipPath>
          </defs>
        </svg>
      </div>
    `;

			answersContainer.appendChild(newAnswerCon);
		});
	}
});

// удаление ответа
document.addEventListener(`click`, function (event) {
	if (event.target.closest(`.delete-answer`)) {
		let answerCon = event.target.closest(`.answer-con`);
		answerCon.remove();
	}
});

// ---------- КОНТРОЛЬ TRUE-FALSE ----------
document.querySelector('#quiz-list').addEventListener('change', (evt) => {
	if (evt.target.type === 'radio' && evt.target.closest('.true-false')) {
		let container = evt.target.closest('.true-false');
		let radios = container.querySelectorAll('input[type="radio"]');

		radios.forEach((radio) => {
			let label = radio.parentElement;
			let svg = label.querySelector('svg');

			if (svg) {
				let rects = svg.querySelectorAll('rect');
				rects.forEach((rect) => {
					if (radio.checked) {
						rect.setAttribute('fill', 'var(--green)');
					} else {
						rect.setAttribute('fill', 'var(--black-full)');
					}
				});
			}
		});
	}
});

// ---------- КОНТРОЛЬ ДОБАВЛЕНИЯ РАЗЛИЧНЫХ ТИПОВ ОТВЕТОВ ----------
document.addEventListener(`DOMContentLoaded`, function () {
	let menuPC = document.querySelector(`#menu-pc`);
	let menuMobile = document.querySelector(`#menu-mobile`);

	let questionCount = 0;

	// множественный выбор
	let addMultipleChoiceQuestion = () => {
		questionCount++;

		let questionHTML = `
		<div class="question">
			<div class="question-con">
			  <div role="button" class="delete-question" tabindex="0">
					<img
						src="./assets/icons/cross.png"
						alt="удалить вопрос"
						title="удалить вопрос"
						width="24"
						height="24"
					/>
				</div>
				<div class="question-number">${questionCount}</div>
				<input type="text" id="question-${questionCount}" name="question-${questionCount}" class="question-text btn" placeholder="Вопрос">
			</div>
			<div class="answers multiple-choice">
				<div class="answer-con">
					<label for="correct-${questionCount}-1" class="custom-checkbox">
						<input type="checkbox" id="correct-${questionCount}-1" name="checkbox-correct-${questionCount}-1" value="...">
						<span class="checkmark"></span>
					</label>
					<input class="btn" placeholder="Ответ">
				</div>
				<div class="answer-con">
					<label for="correct-${questionCount}-2" class="custom-checkbox">
						<input type="checkbox" id="correct-${questionCount}-2" name="checkbox-correct-${questionCount}-2" value="...">
						<span class="checkmark"></span>
					</label>
					<input class="btn" placeholder="Ответ">
				</div>
				<div class="answer-con">
					<label for="correct-${questionCount}-3" class="custom-checkbox">
						<input type="checkbox" id="correct-${questionCount}-3" name="checkbox-correct-${questionCount}-3" value="...">
						<span class="checkmark"></span>
					</label>
					<input class="btn" placeholder="Ответ">
					<div role="button" class="delete-answer" tabindex="0">
						<svg width="16" height="16" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0_310_33)">
								<rect x="0.302307" y="8.48535" width="12" height="75.5977" rx="6" transform="rotate(-45 0.302307 8.48535)" fill="#dedede"></rect>
								<rect x="53.7579" width="12" height="75.5977" rx="6" transform="rotate(45 53.7579 0)" fill="#dedede"></rect>
							</g>
							<defs>
								<clipPath id="clip0_310_33">
									<rect width="60" height="60.0001" fill="none" transform="translate(0.302307)"></rect>
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
			</div>
			<div role="button" class="add-answer btn btn-secondary" tabindex="0">Добавить ответ</div>
		</div>
		`;

		document
			.querySelector(`#quiz-list`)
			.insertAdjacentHTML(`beforeend`, questionHTML);
	};

	// истинно / ложно
	let addTrueFalseQuestion = () => {
		questionCount++;

		let questionHTML = `
        <div class="question">
          <div class="question-con">
					<div role="button" class="delete-question" tabindex="0">
						<img
							src="./assets/icons/cross.png"
							alt="удалить вопрос"
							title="удалить вопрос"
							width="24"
							height="24"
						/>
					</div>
            <div class="question-number">${questionCount}</div>
            <input type="text" id="question-${questionCount}" name="question-${questionCount}" class="question-text btn" placeholder="Вопрос">
          </div>
          <div class="answers true-false">
            <div class="answer-con">
              <input type="radio" id="true-${questionCount}" name="true-false-${questionCount}" />
              <label for="true-${questionCount}">
                <svg width="60" height="60" viewBox="0 0 52 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_310_29)">
                    <rect x="41.6785" width="12" height="62" rx="6" transform="rotate(26.5973 41.6785 0)" fill="#323232"></rect>
                    <rect x="0.697632" y="28.9199" width="12" height="37.2388" rx="6" transform="rotate(-29.5603 0.697632 28.9199)" fill="#323232"></rect>
                  </g>
                  <defs>
                    <clipPath id="clip0_310_29">
                      <rect width="60" height="60" fill="transparent" transform="translate(0.697632)"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </label>
            </div>
            <div class="answer-con">
              <input type="radio" id="false-${questionCount}" name="true-false-${questionCount}" />
              <label for="false-${questionCount}">
                <svg width="60" height="60" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_310_33)">
                    <rect x="0.302307" y="8.48535" width="12" height="75.5977" rx="6" transform="rotate(-45 0.302307 8.48535)" fill="#323232"></rect>
                    <rect x="53.7579" width="12" height="75.5977" rx="6" transform="rotate(45 53.7579 0)" fill="#323232"></rect>
                  </g>
                  <defs>
                    <clipPath id="clip0_310_33">
                      <rect width="60" height="60" fill="transparent" transform="translate(0.302307)"></rect>
                    </clipPath>
                  </defs>
                </svg>
              </label>
            </div>
          </div>
        </div>
      `;
		document
			.querySelector(`#quiz-list`)
			.insertAdjacentHTML(`beforeend`, questionHTML);
	};

	// открытый вопрос
	let addOpenTextQuestion = () => {
		questionCount++;

		let questionHTML = `
        <div class="question">
          <div class="question-con">
						<div role="button" class="delete-question" tabindex="0">
							<img
								src="./assets/icons/cross.png"
								alt="удалить вопрос"
								title="удалить вопрос"
								width="24"
								height="24"
							/>
						</div>
            <div class="question-number">${questionCount}</div>
            <input type="text" id="question-${questionCount}" name="question-${questionCount}" class="question-text btn" placeholder="Вопрос">
          </div>
          <div class="answers open-text">
            <textarea id="open-text-${questionCount}" name="open-text-${questionCount}" placeholder="Ответ"></textarea>
          </div>
        </div>
      `;
		document
			.querySelector(`#quiz-list`)
			.insertAdjacentHTML(`beforeend`, questionHTML);
	};

	// обработчики событий для кнопок
	menuPC
		.querySelector('#multiple-choice')
		.addEventListener('click', addMultipleChoiceQuestion);
	menuPC
		.querySelector('#true-false')
		.addEventListener('click', addTrueFalseQuestion);
	menuPC
		.querySelector('#open-text')
		.addEventListener('click', addOpenTextQuestion);

	menuMobile
		.querySelector('#multiple-choice')
		.addEventListener('click', addMultipleChoiceQuestion);
	menuMobile
		.querySelector('#true-false')
		.addEventListener('click', addTrueFalseQuestion);
	menuMobile
		.querySelector('#open-text')
		.addEventListener('click', addOpenTextQuestion);

	// делегирование событий для кнопки добавления ответа
	document
		.querySelector('#quiz-list')
		.addEventListener('click', function (event) {
			if (event.target.classList.contains('add-answer')) {
				let question = event.target.closest('.question');
				let answersContainer = question.querySelector('.multiple-choice');
				if (answersContainer) {
					let newAnswerId = `correct-${answersContainer.children.length + 1}`;
					let newAnswerCon = document.createElement('div');
					newAnswerCon.classList.add('answer-con');
					newAnswerCon.innerHTML = `
          <label for="${newAnswerId}" class="custom-checkbox">
            <input type="checkbox" id="${newAnswerId}" name="checkbox-${newAnswerId}" value="...">
            <span class="checkmark"></span>
          </label>
          <input class="btn" placeholder="Ответ">
          <div role="button" class="delete-answer" tabindex="0">
            <svg width="16" height="16" viewBox="0 0 61 60" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clip-path="url(#clip0_310_33)">
								<rect x="0.302307" y="8.48535" width="12" height="75.5977" rx="6" transform="rotate(-45 0.302307 8.48535)" fill="#dedede"></rect>
								<rect x="53.7579" width="12" height="75.5977" rx="6" transform="rotate(45 53.7579 0)" fill="#dedede"></rect>
							</g>
							<defs>
								<clipPath id="clip0_310_33">
									<rect width="60" height="60.0001" fill="none" transform="translate(0.302307)"></rect>
								</clipPath>
							</defs>
						</svg>
          </div>
        `;
					answersContainer.appendChild(newAnswerCon);
				}
			}
		});
});

// ---------- ДОБАВЛЕНИЕ ТАЙМЕРА ----------
let timer = document.querySelector(`.popup-con`);
let saveTimer = document.querySelector(`#save-timer`);
let deleteTimer = document.querySelector(`#delete-timer`);

let input_hours = document.createElement(`input`);
input_hours.id = `input_hours`;
input_hours.hidden = true;

let input_minutes = document.createElement(`input`);
input_minutes.id = `input_minutes`;
input_minutes.hidden = true;

let totalTime = ``;

let hours;
let minutes;
let popup;

saveTimer.addEventListener(`click`, () => {
	hours = parseInt(timer.querySelector(`#hours`).value) || 0;
	minutes = parseInt(timer.querySelector(`#minutes`).value) || 0;

	if (hours !== 0) {
		totalTime += `${hours} ч `;
		input_hours.value = hours;
		document
			.querySelector(`form`)
			.insertAdjacentElement(`afterbegin`, input_hours);
	}
	if (minutes !== 0) {
		totalTime += `${minutes} мин`;
		input_minutes.value = minutes;
		document
			.querySelector(`form`)
			.insertAdjacentElement(`afterbegin`, input_minutes);
	}

	if (totalTime !== ``) {
		document.querySelector(`#menu-pc .open-popup`).innerHTML = `
		<img
			src="./assets/icons/pencil-black.png"
			alt="редактировать таймер"
			aria-labelledby="редактировать таймер"
			title="редактировать"
		/>
		<span>${totalTime}</span>
		`;

		document.querySelector(`#menu-mobile .open-popup`).innerHTML = `
		<span>${totalTime}</span>
		<img
			src="./assets/icons/pencil-black.png"
			alt="редактировать таймер"
			aria-labelledby="редактировать таймер"
			title="редактировать"
		/>
		`;

		totalTime = ``;
	}
});

deleteTimer.addEventListener(`click`, () => {
	document.querySelector(`#menu-pc .open-popup`).innerHTML = `
	<img src="./assets/icons/plus.png" alt="+" />
	<span>Таймер</span>
	`;

	document.querySelector(`#menu-mobile .open-popup`).innerHTML = `
	<span>Таймер</span>
	`;

	if (document.querySelector(`#input_hours`))
		document.querySelector(`#input_hours`).remove();

	if (document.querySelector(`#input_minutes`))
		document.querySelector(`#input_minutes`).remove();
});

// ---------- УДАЛИТЬ ВОПРОС ----------
document
	.querySelector('#quiz-list')
	.addEventListener('click', function (event) {
		if (event.target.closest('.delete-question')) {
			let question = event.target.closest('.question');
			question.remove();

			// пересчет номеров вопросов
			let questions = document.querySelectorAll('.question');
			questions.forEach((q, index) => {
				q.querySelector('.question-number').textContent = index + 1;
				let input = q.querySelector('.question-text');
				input.id = `question-${index + 1}`;
				input.name = `question-${index + 1}`;

				// обновление идентификаторов и имен ответов
				let answers = q.querySelectorAll('.answer-con input[type="checkbox"]');
				answers.forEach((answer, answerIndex) => {
					let newId = `correct-${index + 1}-${answerIndex + 1}`;
					answer.id = newId;
					answer.name = `checkbox-${newId}`;
					answer.closest('label').setAttribute('for', newId);
				});
			});
		}
	});
