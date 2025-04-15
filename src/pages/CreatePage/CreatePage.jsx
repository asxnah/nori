import { useState, useRef } from 'react';
import './CreatePage.css';
import { PlusIcon } from './icons/PlusIcon';
import { TimerIcon } from './icons/TimerIcon';
import { CrossIcon } from '../../uikit/CrossIcon/CrossIcon';
import { TrueIcon } from './icons/TrueIcon';
import { FalseIcon } from './icons/FalseIcon';

export const CreatePage = () => {
	const [backgroundImage, setBackgroundImage] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [timerValue, setTimerValue] = useState('Таймер');
	const [inputHours, setInputHours] = useState('');
	const [inputMinutes, setInputMinutes] = useState('');

	const coverRef = useRef(null);
	const menuQuestionsRef = useRef(null);
	const dropdownButtonRef = useRef(null);

	const handleSetBackground = (evt) => {
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
			`${hours > 0 ? `${hours} ч` : ''} ${minutes > 0 ? `${minutes} мин` : ''}`
		);
	};

	const handleDeleteTimer = () => {
		setTimerValue('Таймер');
		setInputHours('');
		setInputMinutes('');
	};

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
								onClick={handleRemoveBackground}
							>
								Удалить фон
							</div>
						</div>
						<div
							id="upload"
							style={{
								backgroundImage: backgroundImage
									? `url(${backgroundImage})`
									: '',
								backgroundSize: 'cover',
								backgroundPosition: 'center',
							}}
						>
							<div id="upload-overlay">
								<img
									src="./assets/icons/UploadIcon.png"
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
								onChange={handleSetBackground}
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
								<button id="multipleChoice" className="btn btn-secondary">
									<PlusIcon />
									<span>Выбор</span>
								</button>
								<button id="trueFalse" className="btn btn-secondary">
									<PlusIcon />
									<span>Истинно / Ложно</span>
								</button>
								<button id="openText" className="btn btn-secondary">
									<PlusIcon />
									<span>Открытый вопрос</span>
								</button>
								<button id="timer" className="btn btn-secondary">
									<TimerIcon />
									<span>{timerValue ? timerValue : 'Таймер'}</span>
								</button>
							</menu>

							<menu id="menu-mobile">
								<div
									role="button"
									id="dropdown-button"
									className="btn btn-secondary"
									ref={dropdownButtonRef}
									onClick={toggleDropdown}
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
									<button id="multipleChoice">
										<span>Выбор</span>
									</button>
									<button id="trueFalse">
										<span>Истинно / Ложно</span>
									</button>
									<button id="openText">
										<span>Открытый вопрос</span>
									</button>
									<button id="timer" className="timer">
										<span>{timerValue ? timerValue : 'Таймер'}</span>
									</button>
								</div>
							</menu>
						</div>

						<div id="quiz-list">
							<div className="question">
								<div className="question-con">
									<button className="delete-question">
										<CrossIcon width={18} height={18} />
									</button>
									<div className="question-number">1</div>
									<input
										type="text"
										name="question-1"
										className="question-text btn"
										placeholder="Вопрос"
									/>
								</div>
								<div className="answers multipleChoice">
									<div className="answer-con">
										<label htmlFor="answer" className="custom-checkbox">
											<input
												type="checkbox"
												id="answer"
												name="checkbox-answer"
											/>
											<span className="checkmark"></span>
										</label>
										<input className="btn" placeholder="Ответ" />
									</div>
									<div className="answer-con">
										<label htmlFor="answer" className="custom-checkbox">
											<input
												type="checkbox"
												id="answer"
												name="checkbox-answer"
											/>
											<span className="checkmark"></span>
										</label>
										<input className="btn" placeholder="Ответ" />
									</div>
									<div className="answer-con">
										<label htmlFor="answer" className="custom-checkbox">
											<input
												type="checkbox"
												id="answer"
												name="checkbox-answer"
											/>
											<span className="checkmark"></span>
										</label>
										<input className="btn" placeholder="Ответ" />
										<button className="delete-answer">
											<CrossIcon width={16} height={16} />
										</button>
									</div>
								</div>
								<div role="button" className="add-answer btn btn-secondary">
									Добавить ответ
								</div>
							</div>
							<div className="question">
								<div className="question-con">
									<button className="delete-question">
										<CrossIcon width={18} height={18} />
									</button>
									<div className="question-number">2</div>
									<input
										type="text"
										name="question"
										className="question-text btn"
										placeholder="Вопрос"
									/>
								</div>
								<div className="answers trueFalse">
									<div className="answer-con">
										<input type="radio" id="true" name="trueFalse" />
										<label htmlFor="true">
											<TrueIcon />
										</label>
									</div>
									<div className="answer-con">
										<input type="radio" id="false" name="trueFalse" />
										<label htmlFor="false">
											<FalseIcon />
										</label>
									</div>
								</div>
							</div>
							<div className="question">
								<div className="question-con">
									<button className="delete-question">
										<CrossIcon width={18} height={18} />
									</button>
									<div className="question-number">3</div>
									<input
										type="text"
										id="question"
										name="question"
										className="question-text btn"
										placeholder="Вопрос"
									/>
								</div>
								<div className="answers openText">
									<textarea
										id="openText"
										name="openText"
										placeholder="Ответ"
									></textarea>
								</div>
							</div>
						</div>

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
						<button className="close-popup">
							<img
								src="./assets/icons/cross.png"
								alt="закрыть окно"
								title="закрыть окно"
							/>
						</button>
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
							onClick={handleSaveTimer}
						>
							Сохранить
						</div>
						<div role="button" className="btn btn-secondary close-popup">
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
