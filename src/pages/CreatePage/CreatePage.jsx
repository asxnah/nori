import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
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
	const [questions, setQuestions] = useState([]);
	const [quizTitle, setQuizTitle] = useState('');
	const [tags, setTags] = useState(['', '', '']);
	const [description, setDescription] = useState('');
	const [backgroundFile, setBackgroundFile] = useState(null);
	const navigate = useNavigate();
	const [error, setError] = useState('');

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
		const file = evt.target.files[0];
		if (file) {
			setBackgroundFile(file);
			let reader = new FileReader();
			reader.onload = function (e) {
				setBackgroundImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveBackground = () => {
		setBackgroundImage(null);
		setBackgroundFile(null);
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

	const addQuestion = (type) => {
		const newQuestion = {
			id: Date.now(),
			type,
			text: '',
			answers: type === 'multipleChoice' ? ['', ''] : [],
			correctAnswer:
				type === 'trueFalse' ? true : type === 'multipleChoice' ? [] : '',
		};
		setQuestions([...questions, newQuestion]);
		setIsDropdownOpen(false);
	};

	const handleQuestionTextChange = (id, text) => {
		setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
	};

	const handleAnswerChange = (questionId, answerIndex, text) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId) {
					const newAnswers = [...q.answers];
					newAnswers[answerIndex] = text;
					return { ...q, answers: newAnswers };
				}
				return q;
			})
		);
	};

	const handleCorrectAnswerChange = (questionId, answerIndex) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId) {
					if (q.type === 'multipleChoice') {
						const newCorrectAnswers = [...(q.correctAnswer || [])];
						const index = newCorrectAnswers.indexOf(answerIndex);
						if (index === -1) {
							newCorrectAnswers.push(answerIndex);
						} else {
							newCorrectAnswers.splice(index, 1);
						}
						return { ...q, correctAnswer: newCorrectAnswers };
					} else if (q.type === 'trueFalse') {
						return { ...q, correctAnswer: answerIndex };
					} else {
						return { ...q, correctAnswer: answerIndex };
					}
				}
				return q;
			})
		);
	};

	const addAnswer = (questionId) => {
		setQuestions(
			questions.map((q) =>
				q.id === questionId ? { ...q, answers: [...q.answers, ''] } : q
			)
		);
	};

	const removeAnswer = (questionId, answerIndex) => {
		setQuestions(
			questions.map((q) => {
				if (q.id === questionId) {
					const newAnswers = [...q.answers];
					newAnswers.splice(answerIndex, 1);
					return { ...q, answers: newAnswers };
				}
				return q;
			})
		);
	};

	const removeQuestion = (questionId) => {
		setQuestions(questions.filter((q) => q.id !== questionId));
	};

	const handleQuizTitleChange = (evt) => {
		setQuizTitle(evt.target.value);
	};

	const handleTagChange = (index, value) => {
		const newTags = [...tags];
		newTags[index] = value;
		setTags(newTags);
	};

	const handleDescriptionChange = (evt) => {
		setDescription(evt.target.value);
	};

	const isQuizValid = () => {
		if (!quizTitle.trim()) return false;

		if (!tags.every((tag) => tag.trim())) return false;

		if (questions.length === 0) return false;

		return questions.every((question) => {
			if (!question.text.trim()) return false;

			switch (question.type) {
				case 'openText':
					return question.correctAnswer.trim() !== '';
				case 'multipleChoice':
					return (
						question.answers.length >= 2 &&
						question.answers.every((answer) => answer.trim())
					);
				case 'trueFalse':
					return typeof question.correctAnswer === 'boolean';
				default:
					return false;
			}
		});
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		setError('');

		if (!isQuizValid()) {
			setError('Пожалуйста, заполните все обязательные поля');
			return;
		}

		try {
			const userData = JSON.parse(Cookies.get('user'));
			if (!userData?.id) {
				setError('Ошибка авторизации. Пожалуйста, войдите снова.');
				return;
			}

			const formData = new FormData();
			formData.append('title', quizTitle);
			formData.append('description', description.trim() || '');
			if (backgroundFile) {
				formData.append('background', backgroundFile);
			}
			formData.append('tags', JSON.stringify(tags.filter((tag) => tag.trim())));
			formData.append(
				'questions',
				JSON.stringify(
					questions.map((q) => ({
						text: q.text,
						type: q.type,
						answers: q.answers,
						correctAnswer: q.correctAnswer,
					}))
				)
			);
			formData.append('createdBy', userData.id);

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/quizzes`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);

			if (response.data.testId) {
				navigate(`/quiz?id=${response.data.testId}`);
			}
		} catch (error) {
			console.error('Error saving quiz:', error);
			if (error.response) {
				setError(
					error.response.data.message || 'Ошибка при сохранении викторины'
				);
			} else {
				setError('Ошибка соединения с сервером');
			}
		}
	};

	const renderQuestion = (question, index) => {
		return (
			<div className="question" key={question.id}>
				<div className="question-con">
					<button
						type="button"
						className="delete-question"
						onClick={() => removeQuestion(question.id)}
					>
						<CrossIcon width={18} height={18} />
					</button>
					<div className="question-number">{index + 1}</div>
					<input
						type="text"
						className="question-text btn"
						placeholder="Вопрос"
						value={question.text}
						onChange={(e) =>
							handleQuestionTextChange(question.id, e.target.value)
						}
					/>
				</div>
				{question.type === 'multipleChoice' && (
					<div className="multipleChoice">
						<div className="answers">
							{question.answers.map((answer, i) => (
								<div className="answer-con" key={i}>
									<label className="custom-checkbox">
										<input
											type="checkbox"
											checked={question.correctAnswer?.includes(i) || false}
											onChange={() => handleCorrectAnswerChange(question.id, i)}
										/>
										<span className="checkmark"></span>
									</label>
									<input
										className="btn"
										placeholder="Ответ"
										value={answer}
										onChange={(e) =>
											handleAnswerChange(question.id, i, e.target.value)
										}
									/>
									{i > 1 && (
										<button
											type="button"
											className="delete-answer"
											onClick={() => removeAnswer(question.id, i)}
										>
											<CrossIcon width={16} height={16} />
										</button>
									)}
								</div>
							))}
						</div>
						<div
							className="add-answer btn btn-secondary"
							onClick={() => addAnswer(question.id)}
						>
							Добавить ответ
						</div>
					</div>
				)}
				{question.type === 'trueFalse' && (
					<div className="answers trueFalse">
						<div className="answer-con">
							<input
								type="radio"
								name={`trueFalse-${question.id}`}
								checked={question.correctAnswer === true}
								onChange={() => handleCorrectAnswerChange(question.id, true)}
							/>
							<label>
								<TrueIcon />
							</label>
						</div>
						<div className="answer-con">
							<input
								type="radio"
								name={`trueFalse-${question.id}`}
								checked={question.correctAnswer === false}
								onChange={() => handleCorrectAnswerChange(question.id, false)}
							/>
							<label>
								<FalseIcon />
							</label>
						</div>
					</div>
				)}
				{question.type === 'openText' && (
					<div className="answers openText">
						<textarea
							placeholder="Правильный ответ"
							value={question.correctAnswer}
							onChange={(e) =>
								handleCorrectAnswerChange(question.id, e.target.value)
							}
						></textarea>
					</div>
				)}
			</div>
		);
	};

	return (
		<div>
			<main id="CreatePage">
				{error && <div className="error-message">{error}</div>}
				<form onSubmit={handleSubmit}>
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
								<p>
									Загрузить фон <br /> (необязательно)
								</p>
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
								className="btn"
								placeholder="Название *"
								value={quizTitle}
								onChange={handleQuizTitleChange}
							/>
							<textarea
								placeholder="Описание (необязательно)"
								value={description}
								onChange={handleDescriptionChange}
							></textarea>
							<div id="tags">
								{tags.map((tag, index) => (
									<input
										key={index}
										type="text"
										className="tag btn"
										placeholder="Тег *"
										value={tag}
										onChange={(e) => handleTagChange(index, e.target.value)}
									/>
								))}
							</div>
						</div>
					</section>

					<section id="quiz">
						<div id="quizzes-heading">
							<h2>Вопросы</h2>
							<menu id="menu-pc">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => addQuestion('multipleChoice')}
								>
									<PlusIcon />
									<span>Выбор</span>
								</button>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => addQuestion('trueFalse')}
								>
									<PlusIcon />
									<span>Истинно / Ложно</span>
								</button>
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => addQuestion('openText')}
								>
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
									<button
										type="button"
										onClick={() => addQuestion('multipleChoice')}
									>
										<PlusIcon />
										<span>Выбор</span>
									</button>
									<button
										type="button"
										onClick={() => addQuestion('trueFalse')}
									>
										<PlusIcon />
										<span>Истинно / Ложно</span>
									</button>
									<button type="button" onClick={() => addQuestion('openText')}>
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
							{questions.map((question, index) =>
								renderQuestion(question, index)
							)}
						</div>

						<div className="group">
							<button
								type="submit"
								className="btn btn-primary"
								disabled={!isQuizValid()}
							>
								Создать
							</button>
							<Link to="/" className="btn btn-secondary">
								<span>Скачать</span>
								<span>DOCX</span>
							</Link>
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
