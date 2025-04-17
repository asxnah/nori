import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './AnswersPage.css';
import { SearchIcon } from '../../uikit/SearchIcon/SearchIcon';

export const AnswersPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const quizId = searchParams.get('id');
	const [quiz, setQuiz] = useState(null);
	const [userAnswers, setUserAnswers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		const fetchQuizData = async () => {
			try {
				const userData = Cookies.get('user');
				if (!userData) {
					setError('Пользователь не авторизован');
					setLoading(false);
					return;
				}

				const { id: currentUserId } = JSON.parse(userData);
				if (!currentUserId) {
					setError('ID пользователя не найден');
					setLoading(false);
					return;
				}

				const quizResponse = await axios.get(
					`http://localhost:3000/api/quizzes/${quizId}`
				);
				setQuiz(quizResponse.data);

				if (quizResponse.data.createdBy._id !== currentUserId) {
					navigate('/user');
					setLoading(false);
					return;
				}

				const answersResponse = await axios.get(
					`http://localhost:3000/api/quizzes/${quizId}/answers`
				);
				setUserAnswers(answersResponse.data);
				setLoading(false);
			} catch (err) {
				console.error('Error fetching quiz data:', err);
				setError('Ошибка при загрузке данных');
				setLoading(false);
			}
		};

		if (quizId) {
			fetchQuizData();
		} else {
			setError('ID теста не указан');
			setLoading(false);
		}
	}, [quizId]);

	const calculateScore = (answer) => {
		let correct = 0;
		let total = 0;

		answer.answers.forEach((userAnswer) => {
			const question = quiz.questionIds.find(
				(q) => q._id === userAnswer.questionId._id
			);

			if (!question) return;

			total++;

			if (question.type === 'trueFalse') {
				const userAnswerBool = userAnswer.selected[0] === 'true';
				if (userAnswerBool === question.correctAnswer) {
					correct++;
				}
			} else if (question.type === 'multipleChoice') {
				if (userAnswer.selected[0] === question.correctAnswer) {
					correct++;
				}
			} else if (question.type === 'openText') {
				if (
					userAnswer.selected[0].toLowerCase().trim() ===
					question.correctAnswer.toLowerCase().trim()
				) {
					correct++;
				}
			}
		});

		return { correct, total };
	};

	const filteredAnswers = userAnswers.filter((answer) => {
		const searchLower = searchQuery.toLowerCase();
		const username = answer.userId.username.toLowerCase();
		const name = answer.userId.name.toLowerCase();
		return username.includes(searchLower) || name.includes(searchLower);
	});

	if (loading) {
		return <div>Загрузка ответов...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!quiz) {
		return <div>Тест не найден</div>;
	}

	return (
		<main id="AnswersPage">
			<section id="heading">
				<h2>{quiz.title}</h2>
				<p>Ответы пользователей</p>
			</section>

			<section id="answers">
				<div id="search" className="btn">
					<input
						type="text"
						id="searchbar"
						placeholder="Введите имя пользователя"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<button id="go">
						<SearchIcon />
					</button>
				</div>

				<div id="answers-list">
					{filteredAnswers.map((answer) => {
						const { correct, total } = calculateScore(answer);
						return (
							<Link
								key={answer._id}
								to={`/quiz/results/${answer._id}`}
								className="answer"
							>
								<small>@{answer.userId.username}</small>
								<h5>{answer.userId.name}</h5>
								<p>
									Верных ответов: {correct} из {total}
								</p>
							</Link>
						);
					})}
				</div>
			</section>
		</main>
	);
};
