import { useState, useRef, useEffect } from 'react';
import './CreatePage.css';
import { PlusIcon } from './icons/PlusIcon';
import { TimerIcon } from './icons/TimerIcon';
import { CrossIcon } from '../../uikit/CrossIcon/CrossIcon';
import { TrueIcon } from './icons/TrueIcon';
import { FalseIcon } from './icons/FalseIcon';

export const CreatePage = () => {
	const [backgroundImage, setBackgroundImage] = useState(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [hours, setHours] = useState('');
	const [minutes, setMinutes] = useState('');
	const [isTimerPopupOpen, setIsTimerPopupOpen] = useState(false);

	const coverRef = useRef(null);
	const menuQuestionsRef = useRef(null);
	const dropdownButtonRef = useRef(null);

	const [timerValue, setTimerValue] = useState('Таймер');

	useEffect(() => {
		if (hours && minutes) {
			setTimerValue(`${hours} ч ${minutes} мин`);
		}

		if (hours && !minutes) {
			setTimerValue(`${hours} ч`);
		}

		if (!hours && minutes) {
			setTimerValue(`${minutes} мин`);
		}

		if (!hours && !minutes) {
			setTimerValue('Таймер');
		}
	}, [hours, minutes]);

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
		setHours(evt.target.value);
	};

	const handleMinutesChange = (evt) => {
		setMinutes(evt.target.value);
	};

	const handleTimerButtonClick = () => {
		setIsTimerPopupOpen(true);
	};

	const handleClosePopup = () => {
		setIsTimerPopupOpen(false);
	};

	return (
		<div>
			<main id="CreatePage">
				<form>
					<section id="info" className="card card-outline">
						<div id="heading">
							<h2>О викторине</h2>
							<button
								type="button"
								className="btn btn-secondary"
								onClick={handleRemoveBackground}
							>
								Удалить фон
							</button>
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
								<button type="button" className="btn btn-secondary">
									<PlusIcon />
									<span>Выбор</span>
								</button>
								<button type="button" className="btn btn-secondary">
									<PlusIcon />
									<span>Истинно / Ложно</span>
								</button>
								<button type="button" className="btn btn-secondary">
									<PlusIcon />
									<span>Открытый вопрос</span>
								</button>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={handleTimerButtonClick}
								>
									<TimerIcon />
									<span>{timerValue}</span>
								</button>
							</menu>

							<menu id="menu-mobile">
								<div
									id="dropdown-button"
									className="btn btn-secondary"
									ref={dropdownButtonRef}
									onClick={toggleDropdown}
								>
									<PlusIcon />
								</div>
								<div
									id="menu-questions"
									className={`dropdown-content ${isDropdownOpen ? 'show' : ''}`}
									ref={menuQuestionsRef}
								>
									<button type="button">
										<PlusIcon />
										<span>Выбор</span>
									</button>
									<button type="button">
										<PlusIcon />
										<span>Истинно / Ложно</span>
									</button>
									<button type="button">
										<PlusIcon />
										<span>Открытый вопрос</span>
									</button>
									<button type="button" onClick={handleTimerButtonClick}>
										<TimerIcon />
										<span>{timerValue}</span>
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
										className="question-text btn"
										placeholder="Вопрос"
									/>
								</div>
								<div className="answers multipleChoice">
									<div className="answer-con">
										<label className="custom-checkbox">
											<input type="checkbox" />
											<span className="checkmark"></span>
										</label>
										<input className="btn" placeholder="Ответ" />
									</div>
									<div className="answer-con">
										<label className="custom-checkbox">
											<input type="checkbox" />
											<span className="checkmark"></span>
										</label>
										<input className="btn" placeholder="Ответ" />
									</div>
									<div className="answer-con">
										<label className="custom-checkbox">
											<input type="checkbox" />
											<span className="checkmark"></span>
										</label>
										<input className="btn" placeholder="Ответ" />
										<button className="delete-answer">
											<CrossIcon width={16} height={16} />
										</button>
									</div>
								</div>
								<div className="add-answer btn btn-secondary">
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
										className="question-text btn"
										placeholder="Вопрос"
									/>
								</div>
								<div className="answers trueFalse">
									<div className="answer-con">
										<input type="radio" />
										<label>
											<TrueIcon />
										</label>
									</div>
									<div className="answer-con">
										<input type="radio" />
										<label>
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
										className="question-text btn"
										placeholder="Вопрос"
									/>
								</div>
								<div className="answers openText">
									<textarea placeholder="Ответ"></textarea>
								</div>
							</div>
						</div>

						<div className="group">
							<button type="submit" className="btn btn-primary">
								Создать
							</button>
							<button type="button" className="btn btn-secondary">
								<span>Скачать</span>
								<span>DOCX</span>
							</button>
						</div>
					</section>
				</form>
			</main>

			<section
				className={`popup-con timer-popup ${isTimerPopupOpen ? 'show' : ''}`}
			>
				<div className="popup card card-outline">
					<div className="heading">
						<h2>Таймер</h2>
						<button
							type="button"
							className="close-popup"
							onClick={handleClosePopup}
						>
							<CrossIcon width={18} height={18} />
						</button>
					</div>
					<div className="content">
						<p className="faded-text">
							Заполните хотя бы одно поле для добавления таймера.
						</p>
						<div className="group btn">
							<input
								type="number"
								placeholder="Часы"
								value={hours}
								onChange={handleHoursChange}
							/>
							<label>ч</label>
						</div>
						<div className="group btn">
							<input
								type="number"
								placeholder="Минуты"
								value={minutes}
								onChange={handleMinutesChange}
							/>
							<label>мин</label>
						</div>
					</div>
					<div className="group">
						<div
							className="btn btn-primary close-popup"
							onClick={() => {
								handleClosePopup();
							}}
						>
							Сохранить
						</div>
						<div
							className="btn btn-secondary close-popup"
							onClick={handleClosePopup}
						>
							Отмена
						</div>
					</div>
					<div
						className="faded-text close-popup"
						onClick={() => {
							setHours('');
							setMinutes('');
							setTimerValue('Таймер');
							setIsTimerPopupOpen(false);
						}}
					>
						Удалить таймер
					</div>
				</div>
			</section>
		</div>
	);
};
