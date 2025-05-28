import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
	const [searchParams] = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [timerObject, setTimerObject] = useState(null);

	const coverRef = useRef(null);
	const menuQuestionsRef = useRef(null);
	const dropdownButtonRef = useRef(null);

	const [timerValue, setTimerValue] = useState('Таймер');

	useEffect(() => {
		if (hours && minutes) {
			setTimerValue(`${hours} ч ${minutes} мин`);
			setTimerObject({ hours, minutes });
		} else if (hours && !minutes) {
			setTimerValue(`${hours} ч`);
			setTimerObject({ hours, minutes: 0 });
		} else if (!hours && minutes) {
			setTimerValue(`${minutes} мин`);
			setTimerObject({ hours: 0, minutes });
		} else {
			setTimerValue('Таймер');
			setTimerObject(null);
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
			points: '',
			answers: type === 'multipleChoice' ? ['', ''] : [],
			correctAnswers:
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
						const newCorrectAnswers = [...(q.correctAnswers || [])];
						const index = newCorrectAnswers.indexOf(answerIndex);
						if (index === -1) {
							newCorrectAnswers.push(answerIndex);
						} else {
							newCorrectAnswers.splice(index, 1);
						}
						return { ...q, correctAnswers: newCorrectAnswers };
					} else if (q.type === 'trueFalse') {
						return { ...q, correctAnswers: answerIndex };
					} else {
						return { ...q, correctAnswers: answerIndex };
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
					return question.correctAnswers.trim() !== '';
				case 'multipleChoice':
					return (
						question.answers.length >= 2 &&
						question.answers.every((answer) => answer.trim()) &&
						question.correctAnswers?.length > 0
					);
				case 'trueFalse':
					return typeof question.correctAnswers === 'boolean';
				default:
					return false;
			}
		});
	};

	useEffect(() => {
		const quizId = searchParams.get('id');
		if (quizId) {
			fetchQuizData(quizId);
		}
	}, [searchParams]);

	const fetchQuizData = async (quizId) => {
		setIsLoading(true);
		setError('');
		try {
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`
			);
			const quiz = response.data;

			setQuizTitle(quiz.title);
			setDescription(quiz.description || '');
			setTags(
				quiz.tags.length
					? [...quiz.tags, ...Array(3 - quiz.tags.length).fill('')]
					: ['', '', '']
			);

			if (quiz.background) {
				setBackgroundImage(quiz.background);
			}

			const mappedQuestions = quiz.questionIds.map((q) => ({
				id: q._id,
				type: q.type,
				text: q.questionText,
				answers: q.type === 'multipleChoice' ? q.options : [],
				correctAnswers: q.correctAnswers,
			}));
			setQuestions(mappedQuestions);
		} catch (error) {
			console.error('CATCH Ошибка загрузки данных викторины >> ', error);
			setError('Ошибка загрузки данных викторины');
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		setError('');

		if (!isQuizValid()) {
			setError('Заполните все обязательные поля');
			return;
		}

		try {
			const userData = JSON.parse(Cookies.get('user'));
			if (!userData?.id) {
				setError('Ошибка входа. Попробуйте еще раз позже.');
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
						points: q.points === '' ? 1 : q.points,
						answers: q.answers,
						correctAnswers: q.correctAnswers,
					}))
				)
			);
			formData.append('timer', JSON.stringify(timerObject));
			formData.append('createdBy', userData.id);

			const quizId = searchParams.get('id');
			const url = `${import.meta.env.VITE_API_URL}/api/quizzes${
				quizId ? `/${quizId}` : ''
			}`;
			const method = quizId ? 'put' : 'post';

			try {
				const response = await axios[method](url, formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				});
				navigate(`/quiz?id=${quizId || response.data.testId}`);
			} catch (error) {
				setError(error.response?.data?.message);
			}
		} catch (error) {
			console.error('CATCH ОШИБКА СЕРВЕРА >> ', error.response.data);
			setError(
				error.response?.data?.message ||
					'Ошибка при сохранении викторины. Попробуйте еще раз.'
			);
		}
	};

	const getQuestionErrors = (question) => {
		const errors = {
			text: !question.text.trim(),
			answers:
				question.type === 'multipleChoice' &&
				!question.answers.every((answer) => answer.trim()),
			correctAnswers:
				(question.type === 'multipleChoice' &&
					!question.correctAnswers?.length) ||
				(question.type === 'openText' && !question.correctAnswers?.trim()),
		};
		return errors;
	};

	const handlePointsChange = (questionId, value) => {
		const points =
			value === '' ? 1 : Math.max(0, Math.min(parseInt(value) || 0, 100));
		setQuestions(
			questions.map((q) => (q.id === questionId ? { ...q, points } : q))
		);
	};

	const renderQuestion = (question, index) => {
		const errors = getQuestionErrors(question);

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
					<div className="inputs">
						<input
							type="text"
							className={`question-text btn ${errors.text ? 'error' : ''}`}
							placeholder="Вопрос"
							maxLength={320}
							value={question.text}
							onChange={(e) =>
								handleQuestionTextChange(question.id, e.target.value)
							}
						/>
						<input
							type="number"
							className="question-text btn"
							placeholder="Балл"
							min="0"
							max="100"
							value={question.points}
							onChange={(e) => handlePointsChange(question.id, e.target.value)}
						/>
					</div>
				</div>
				{question.type === 'multipleChoice' && (
					<div className="multipleChoice">
						{errors.correctAnswers && (
							<div className="error-message">
								Выберите хотя бы один правильный ответ
							</div>
						)}
						<div className="answers">
							{question.answers.map((answer, i) => (
								<div className="answer-con" key={i}>
									<label className="custom-checkbox">
										<input
											type="checkbox"
											checked={question.correctAnswers?.includes(i) || false}
											onChange={() => handleCorrectAnswerChange(question.id, i)}
										/>
										<span className="checkmark"></span>
									</label>
									<input
										className={`btn ${errors.answers ? 'error' : ''}`}
										placeholder="Ответ"
										maxLength={320}
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
								checked={question.correctAnswers === true}
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
								checked={question.correctAnswers === false}
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
							className={errors.correctAnswers ? 'error' : ''}
							maxLength={1000}
							value={question.correctAnswers}
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
				{isLoading ? (
					<div className="loading">Загрузка викторины...</div>
				) : (
					<>
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
										className={`btn ${!quizTitle.trim() ? 'error' : ''}`}
										placeholder="Название *"
										value={quizTitle}
										maxLength={80}
										onChange={handleQuizTitleChange}
									/>
									<textarea
										placeholder="Описание (необязательно)"
										value={description}
										maxLength={240}
										onChange={handleDescriptionChange}
									></textarea>
									<div id="tags">
										{tags.map((tag, index) => (
											<input
												key={index}
												type="text"
												className={`tag btn ${!tag.trim() ? 'error' : ''}`}
												placeholder="Тег *"
												value={tag}
												maxLength={30}
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
											className={`dropdown-content ${
												isDropdownOpen ? 'show' : ''
											}`}
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
											<button
												type="button"
												onClick={() => addQuestion('openText')}
											>
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
								{error && <div className="error-message">{error}</div>}
								<button
									type="submit"
									className="btn btn-primary"
									disabled={!isQuizValid()}
								>
									{searchParams.get('id') ? 'Сохранить изменения' : 'Создать'}
								</button>
							</section>
						</form>
					</>
				)}
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
