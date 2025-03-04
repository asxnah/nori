import { useState, useRef, useEffect } from 'react';
import './styles/Create.css';

const Create = () => {
	const [backgroundImage, setBackgroundImage] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [timerValue, setTimerValue] = useState('Таймер');
	const [inputHours, setInputHours] = useState('');
	const [inputMinutes, setInputMinutes] = useState('');
	const [questionCount, setQuestionCount] = useState(1);

	const coverRef = useRef(null);
	const uploadContainerRef = useRef(null);
	const removeBgBtnRef = useRef(null);
	const menuQuestionsRef = useRef(null);
	const dropdownButtonRef = useRef(null);

	const questionTypes = [
		{ id: 'multiple-choice', label: 'Выбор' },
		{ id: 'true-false', label: 'Истинно / Ложно' },
		{ id: 'open-text', label: 'Открытый вопрос' },
		{ id: 'timer', label: timerValue || 'Таймер' },
	];

	const handleKeyDown = (evt) => {
		if (evt.key === 'Enter' || evt.key === ' ') {
			evt.preventDefault();
			evt.target.click();
		}
	};

	const handleFileChange = (evt) => {
		let file = evt.target.files[0];
		if (file) {
			let reader = new FileReader();
			reader.onload = function (e) {
				setBackgroundImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveBackground = () => {
		setBackgroundImage(null);
		if (coverRef.current) {
			coverRef.current.value = null;
		}
	};

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};

	const handleHoursChange = (evt) => {
		setInputHours(evt.target.value);
	};

	const handleMinutesChange = (evt) => {
		setInputMinutes(evt.target.value);
	};

	const handleSaveTimer = () => {
		const hours = parseInt(inputHours) || 0;
		const minutes = parseInt(inputMinutes) || 0;

		setTimerValue(
			`${hours > 0 ? `${hours}ч` : ''}${minutes > 0 ? `${minutes}мин` : ''}`
		);
	};

	const handleDeleteTimer = () => {
		setTimerValue('Таймер');
		setInputHours('');
		setInputMinutes('');
	};

	const addMultipleChoiceQuestion = () => {
		setQuestionCount((prevCount) => prevCount + 1);
		const questionHTML = `
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
			.querySelector('#quiz-list')
			.insertAdjacentHTML('beforeend', questionHTML);
	};

	const addTrueFalseQuestion = () => {
		setQuestionCount((prevCount) => prevCount + 1);
		const questionHTML = `
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
			.querySelector('#quiz-list')
			.insertAdjacentHTML('beforeend', questionHTML);
	};

	const addOpenTextQuestion = () => {
		setQuestionCount((prevCount) => prevCount + 1);
		const questionHTML = `
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
			.querySelector('#quiz-list')
			.insertAdjacentHTML('beforeend', questionHTML);
	};

	const handleAddAnswer = (event) => {
		if (event.target.classList.contains('add-answer')) {
			const question = event.target.closest('.question');
			const answersContainer = question.querySelector('.multiple-choice');
			if (answersContainer) {
				const newAnswerId = `correct-${answersContainer.children.length + 1}`;
				const newAnswerCon = document.createElement('div');
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
	};

	const handleDeleteQuestion = (event) => {
		if (event.target.closest('.delete-question')) {
			const question = event.target.closest('.question');
			question.remove();

			const questions = document.querySelectorAll('.question');
			questions.forEach((q, index) => {
				q.querySelector('.question-number').textContent = index + 1;
				const input = q.querySelector('.question-text');
				input.id = `question-${index + 1}`;
				input.name = `question-${index + 1}`;

				const answers = q.querySelectorAll(
					'.answer-con input[type="checkbox"]'
				);
				answers.forEach((answer, answerIndex) => {
					const newId = `correct-${index + 1}-${answerIndex + 1}`;
					answer.id = newId;
					answer.name = `checkbox-${newId}`;
					answer.closest('label').setAttribute('for', newId);
				});
			});
		}
	};

	// handleDeleteAnswer
	useEffect(() => {
		const handleDeleteAnswer = (event) => {
			if (event.target.closest('.delete-answer')) {
				const answerCon = event.target.closest('.answer-con');
				if (answerCon) {
					answerCon.remove();
				}
			}
		};

		document.addEventListener('click', handleDeleteAnswer);

		return () => {
			document.removeEventListener('click', handleDeleteAnswer);
		};
	}, []);

	// handleClickOutside
	useEffect(() => {
		const handleClickOutside = (evt) => {
			if (
				menuQuestionsRef.current &&
				!menuQuestionsRef.current.contains(evt.target) &&
				!dropdownButtonRef.current.contains(evt.target)
			) {
				setIsDropdownOpen(false);
			}
		};

		window.addEventListener('click', handleClickOutside);
		return () => {
			window.removeEventListener('click', handleClickOutside);
		};
	}, []);

	return (
		<div>
			<main id="CreatePage">
				<form>
					<section id="info" className="card card-outline">
						<div id="heading">
							<h2>О викторине</h2>
							<div
								className="btn btn-secondary"
								id="remove-bg-btn"
								tabIndex="0"
								ref={removeBgBtnRef}
								onClick={handleRemoveBackground}
							>
								Удалить фон
							</div>
						</div>
						<div
							id="upload"
							ref={uploadContainerRef}
							style={{
								backgroundImage: backgroundImage
									? `url(${backgroundImage})`
									: '',
							}}
						>
							<div id="upload-overlay">
								<img
									src="./assets/icons/upload.png"
									id="upload-icon"
									alt="иконка загрузки"
								/>
								<p>Загрузить фон</p>
							</div>
							<input
								type="file"
								name="cover"
								id="cover"
								accept="image/*"
								ref={coverRef}
								onChange={handleFileChange}
							/>
						</div>
						<div className="group">
							<input
								type="text"
								id="title"
								name="title"
								className="btn"
								placeholder="Название"
							/>
							<textarea
								name="description"
								id="description"
								placeholder="Описание"
							></textarea>
							<div id="tags">
								<input
									type="text"
									id="tag-1"
									className="tag btn"
									name="tag-1"
									placeholder="Тег"
								/>
								<input
									type="text"
									id="tag-2"
									className="tag btn"
									name="tag-2"
									placeholder="Тег"
								/>
								<input
									type="text"
									id="tag-3"
									className="tag btn"
									name="tag-3"
									placeholder="Тег"
								/>
							</div>
						</div>
					</section>

					<section id="quiz">
						<div id="quizzes-heading">
							<h2>Вопросы</h2>
							<menu id="menu-pc">
								{questionTypes.map(({ id, label }) => (
									<div
										role="button"
										id={id}
										key={id}
										className={`btn btn-secondary ${
											id === 'timer' ? 'open-popup' : ''
										}`}
										tabIndex="0"
										onKeyDown={handleKeyDown}
										onClick={
											id === 'timer'
												? () => setIsDropdownOpen(false)
												: id === 'multiple-choice'
												? addMultipleChoiceQuestion
												: id === 'true-false'
												? addTrueFalseQuestion
												: addOpenTextQuestion
										}
									>
										{id === 'timer' && timerValue !== 'Таймер' ? (
											<>
												<img
													src="./assets/icons/pencil-black.png"
													alt="редактировать таймер"
												/>
												<span>{label}</span>
											</>
										) : (
											<>
												<img src="./assets/icons/plus.png" alt="+" />
												<span>{label}</span>
											</>
										)}
									</div>
								))}
							</menu>

							<menu id="menu-mobile">
								<div
									role="button"
									id="dropdown-button"
									className="btn btn-secondary"
									tabIndex="0"
									ref={dropdownButtonRef}
									onClick={toggleDropdown}
									onKeyDown={handleKeyDown}
								>
									<img
										src="./assets/icons/plus.png"
										aria-label="добавить вопрос"
										alt="+ добавить вопрос"
									/>
								</div>
								<div
									id="menu-questions"
									className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}
									ref={menuQuestionsRef}
								>
									{questionTypes.map(({ id, label }) => (
										<div
											role="button"
											id={id}
											tabIndex="0"
											key={id}
											className={id === 'timer' ? 'open-popup' : ''}
											onKeyDown={handleKeyDown}
											onClick={
												id === 'timer'
													? () => setIsDropdownOpen(false)
													: id === 'multiple-choice'
													? addMultipleChoiceQuestion
													: id === 'true-false'
													? addTrueFalseQuestion
													: addOpenTextQuestion
											}
										>
											<span>{label}</span>
											{id === 'timer' && timerValue !== 'Таймер' && (
												<img
													src="./assets/icons/pencil-black.png"
													alt="редактировать таймер"
												/>
											)}
										</div>
									))}
								</div>
							</menu>
						</div>

						<div
							id="quiz-list"
							onClick={(event) => {
								handleAddAnswer(event);
								handleDeleteQuestion(event);
							}}
						></div>

						<div className="group">
							<button type="submit" className="btn btn-primary" name="create">
								Создать
							</button>
							<button
								type="submit"
								className="btn btn-secondary"
								name="create_download"
							>
								<span>Скачать</span>
								<span>DOCX</span>
							</button>
						</div>
					</section>
				</form>
			</main>

			<section className="popup-con timer-popup">
				<div className="popup card card-outline">
					<div className="heading">
						<h2>Таймер</h2>
						<div role="button" className="close-popup" tabIndex="0">
							<img
								src="./assets/icons/cross.png"
								alt="закрыть окно"
								title="закрыть окно"
							/>
						</div>
					</div>
					<div className="content">
						<p className="faded-text">
							Заполните хотя бы одно поле для добавления таймера.
						</p>
						<div className="group btn">
							<input
								type="number"
								id="hours"
								name="hours"
								placeholder="Часы"
								value={inputHours}
								onChange={handleHoursChange}
							/>
							<label htmlFor="hours">ч</label>
						</div>
						<div className="group btn">
							<input
								type="number"
								id="minutes"
								name="minutes"
								placeholder="Минуты"
								value={inputMinutes}
								onChange={handleMinutesChange}
							/>
							<label htmlFor="minutes">мин</label>
						</div>
					</div>
					<div className="group">
						<div
							role="button"
							id="save-timer"
							className="btn btn-primary close-popup"
							tabIndex="0"
							onClick={handleSaveTimer}
						>
							Сохранить
						</div>
						<div
							role="button"
							className="btn btn-secondary close-popup"
							tabIndex="0"
						>
							Отмена
						</div>
					</div>
					<div
						role="button"
						id="delete-timer"
						className="faded-text close-popup"
						onClick={handleDeleteTimer}
					>
						Удалить таймер
					</div>
				</div>
			</section>
		</div>
	);
};

export default Create;
