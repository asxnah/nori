// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { CrossIcon } from '../../uikit/CrossIcon/CrossIcon';
import QuizCard from '../../components/QuizCard';
import './UserPage.css';

export const UserPage = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useState({ name: '', username: '', id: '' });
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [formData, setFormData] = useState({
		new_name: '',
		new_username: '',
		new_password: '',
		current_password: '',
	});
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('created');
	const [createdQuizzes, setCreatedQuizzes] = useState([]);
	const [completedQuizzes, setCompletedQuizzes] = useState([]);
	const [completedLoading, setCompletedLoading] = useState(true);

	useEffect(() => {
		const userData = Cookies.get('user');
		if (userData) {
			try {
				const parsedData = JSON.parse(userData);
				setUser({
					name: parsedData.name || parsedData.username || userData,
					username: parsedData.username || userData,
					id: parsedData.id || '',
				});
			} catch {
				setUser({
					name: userData,
					username: userData,
					id: '',
				});
			}
		}
	}, []);

	useEffect(() => {
		const fetchUserQuizzes = async () => {
			console.debug('fetchUserQuizzes' + user.id);
			if (user.id) {
				try {
					const response = await axios.get(
						`${import.meta.env.VITE_API_URL}/api/quizzes/user/${user.id}`
					);
					setCreatedQuizzes(Array.isArray(response.data) ? response.data : []);
					setLoading(false);
				} catch (error) {
					console.error('CATCH Ошибка загрузки созданных викторин >> ', error);
					setCreatedQuizzes([]);
					setLoading(false);
				}
			}
		};

		fetchUserQuizzes();
	}, [user.id]);

	useEffect(() => {
		const fetchCompletedQuizzes = async () => {
			console.debug('fetchCompletedQuizzes' + user.id);
			if (user.id) {
				try {
					const response = await axios.get(
						`${import.meta.env.VITE_API_URL}/api/quizzes/answers/user/${
							user.id
						}`
					);
					setCompletedQuizzes(
						Array.isArray(response.data) ? response.data : []
					);
					setCompletedLoading(false);
				} catch (error) {
					console.error(
						'CATCH Ошибка загрузки завершенных викторин >> ',
						error
					);
					setCompletedQuizzes([]);
					setCompletedLoading(false);
				}
			}
		};

		fetchCompletedQuizzes();
	}, [user.id]);

	useEffect(() => {
		const path = location.pathname;
		if (path.includes('/completed')) {
			setActiveTab('completed');
		} else {
			setActiveTab('created');
		}
	}, [location.pathname]);

	const handleLogout = () => {
		Cookies.remove('isAuthenticated');
		Cookies.remove('user');
		navigate('/auth');
	};

	const handleChange = (evt) => {
		const { name, value } = evt.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleShowPopup = () => {
		setIsPopupVisible(true);
	};

	const handleHidePopup = () => {
		setIsPopupVisible(false);
		setError('');
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		setError('');

		const hasChanges = Object.entries(formData).some(([key, value]) => {
			if (key === 'current_password') return false;
			return value.trim() !== '';
		});

		if (!hasChanges) {
			handleHidePopup();
			return;
		}

		if (!formData.current_password) {
			setError('Для внесения изменений необходимо ввести текущий пароль');
			return;
		}

		try {
			await axios.post(`${import.meta.env.VITE_API_URL}/api/update-profile`, {
				...formData,
				current_username: user.username,
			});

			const updatedUser = {
				id: user.id,
				name: formData.new_name || user.name,
				username: formData.new_username || user.username,
			};
			Cookies.set('user', JSON.stringify(updatedUser), { expires: 30 });

			setUser(updatedUser);
			setFormData({
				new_name: '',
				new_username: '',
				new_password: '',
				current_password: '',
			});
			handleHidePopup();
		} catch (error) {
			setError(
				error.response?.data?.message ||
					'Произошла ошибка при обновлении профиля'
			);
		}
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		navigate(`/user/${tab}`);
	};

	const calculateScore = (quiz) => {
		let earnedPoints = 0;
		let totalPoints = 0;

		quiz.answers.forEach((answer) => {
			const question = quiz.testId.questionIds.find((q) => {
				return q._id === answer.questionId._id;
			});

			if (!question) return;

			const questionPoints = question.points || 0;
			if (questionPoints <= 0) return;

			totalPoints += questionPoints;

			const rawSelections = Array.isArray(answer.selected)
				? answer.selected
				: [answer.selected];

			const isUnanswered = rawSelections.every(
				(sel) => sel === null || sel === undefined
			);
			if (isUnanswered) return;

			if (question.type === 'trueFalse') {
				const userAnswer =
					answer.selected === true ||
					(Array.isArray(answer.selected) && answer.selected[0] === true) ||
					answer.selected === 'true' ||
					(Array.isArray(answer.selected) && answer.selected[0] === 'true');
				const correctAnswer =
					question.correctAnswers === true ||
					question.correctAnswers === 'true';
				if (userAnswer === correctAnswer) {
					earnedPoints += questionPoints;
				}
			} else if (question.type === 'multipleChoice') {
				const selectedAnswers = new Set(
					rawSelections
						.filter((sel) => sel !== null && sel !== undefined)
						.map(Number)
				);
				const correctAnswersArray = Array.isArray(question.correctAnswers)
					? question.correctAnswers
					: [question.correctAnswers];
				const correctAnswersSet = new Set(correctAnswersArray.map(Number));

				if (
					selectedAnswers.size > 0 &&
					selectedAnswers.size === correctAnswersSet.size &&
					[...selectedAnswers].every((ans) => correctAnswersSet.has(ans))
				) {
					earnedPoints += questionPoints;
				}
			} else if (question.type === 'openText') {
				const normalizeText = (text) => {
					if (!text) return '';
					return text.toString().toLowerCase().trim().replace(/\s+/g, ' ');
				};
				const userText = normalizeText(
					Array.isArray(answer.selected) ? answer.selected[0] : answer.selected
				);
				const correctText = normalizeText(question.correctAnswers);
				if (userText === correctText) {
					earnedPoints += questionPoints;
				}
			}
		});

		return { correct: earnedPoints, total: totalPoints };
	};

	const handleDeleteQuiz = async (quizId) => {
		if (window.confirm('Вы уверены, что хотите удалить этот тест?')) {
			try {
				await axios.delete(
					`${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`
				);
				setCreatedQuizzes((prevQuizzes) =>
					prevQuizzes.filter((quiz) => quiz._id !== quizId)
				);
				setCompletedQuizzes((prevQuizzes) =>
					prevQuizzes.filter((quiz) => quiz._id !== quizId)
				);
			} catch (error) {
				console.error('CATCH Ошибка при удалении теста >> ', error);
				alert('Ошибка при удалении теста');
			}
		}
	};

	return (
		<div id="UserPage">
			<main>
				<aside className="card card-outline">
					<section id="name">
						<p className="faded-text">@{user.username}</p>
						<h1>{user.name}</h1>
					</section>
					<hr />
					<section id="stats">
						<h3>Статистика</h3>
						<div className="group">
							<div className="group-el">
								<p>Пройдено</p>
								<hr />
								<p id="completed" className="counter">
									{completedQuizzes.length}
								</p>
							</div>
							<div className="group-el">
								<p>Создано</p>
								<hr />
								<p id="created" className="counter">
									{createdQuizzes.length}
								</p>
							</div>
						</div>
						<hr />
						<button className="btn btn-secondary" onClick={handleShowPopup}>
							Редактировать аккаунт
						</button>
						<button className="faded-text" onClick={handleLogout}>
							Выйти из аккаунта
						</button>
					</section>
				</aside>

				<div id="quizzes">
					<menu>
						<ul id="tabs">
							<li
								id="tab-created"
								className={`tab ${activeTab === 'created' ? 'active' : ''}`}
							>
								<Link
									to="/user/created"
									onClick={() => handleTabChange('created')}
								>
									Созданные
								</Link>
								<Link to="/create" className="btn btn-secondary">
									Создать
								</Link>
							</li>
							<li
								id="tab-completed"
								className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
								onClick={() => handleTabChange('completed')}
							>
								<Link to="/user/completed">Пройденные</Link>
							</li>
						</ul>
					</menu>

					<div id="quizzes-list">
						{activeTab === 'created' ? (
							loading ? (
								<p>Загрузка викторин...</p>
							) : createdQuizzes.length === 0 ? (
								<p>У вас пока нет созданных викторин</p>
							) : (
								createdQuizzes.map((quiz) => (
									<QuizCard
										key={quiz._id}
										id={quiz._id}
										title={quiz.title}
										questionsCount={quiz.questionIds.length}
										tags={quiz.tags}
										background={quiz.background}
										type="created"
										onDelete={handleDeleteQuiz}
									/>
								))
							)
						) : completedLoading ? (
							<p>Загрузка пройденных викторин...</p>
						) : completedQuizzes.length === 0 ? (
							<p>У вас пока нет пройденных викторин</p>
						) : (
							completedQuizzes.map((quiz) => (
								<QuizCard
									key={quiz.testId._id}
									id={quiz.testId._id}
									title={quiz.testId.title}
									questionsCount={quiz.testId.questionIds.length}
									tags={quiz.testId.tags}
									background={quiz.testId.background}
									type="completed"
									correctAnswers={calculateScore(quiz).correct}
									link={quiz._id}
									totalAnswers={calculateScore(quiz).total}
								/>
							))
						)}
					</div>
				</div>
			</main>

			<section className={`popup-con ${isPopupVisible ? 'show' : ''}`}>
				<form className="popup card card-outline" onSubmit={handleSubmit}>
					<div className="heading">
						<h2>Редактирование профиля</h2>
						<button type="button" onClick={handleHidePopup}>
							<CrossIcon />
						</button>
					</div>
					<div className="content">
						{error && <div className="error-message">{error}</div>}
						<input
							type="text"
							id="new_name"
							className="btn"
							name="new_name"
							autoComplete="name"
							placeholder="Имя"
							value={formData.new_name}
							onChange={handleChange}
						/>
						<input
							type="text"
							id="new_username"
							className="btn"
							name="new_username"
							autoComplete="username"
							placeholder="Логин"
							value={formData.new_username}
							onChange={handleChange}
						/>
						<input
							type="password"
							id="new_password"
							className="btn"
							name="new_password"
							autoComplete="new-password"
							placeholder="Новый пароль (необязательно)"
							value={formData.new_password}
							onChange={handleChange}
						/>
						<input
							type="password"
							id="current_password"
							className="btn"
							name="current_password"
							autoComplete="current-password"
							placeholder="Текущий пароль"
							value={formData.current_password}
							onChange={handleChange}
						/>
					</div>
					<div className="group">
						<button type="submit" className="btn btn-primary">
							Сохранить
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={handleHidePopup}
						>
							Отмена
						</button>
					</div>
				</form>
			</section>
		</div>
	);
};
