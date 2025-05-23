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
					`${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`
				);
				setQuiz(quizResponse.data);

				if (quizResponse.data.createdBy._id !== currentUserId) {
					navigate('/user');
					setLoading(false);
					return;
				}

				const answersResponse = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}/answers`
				);
				setUserAnswers(answersResponse.data);
				setLoading(false);
			} catch (err) {
				console.error('CATCH Ошибка при загрузке данных >> ', err);
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

	const calculateScore = (userAnswer) => {
		let earnedPoints = 0;
		let totalPoints = 0;

		userAnswer.answers.forEach((answer) => {
			const question = quiz.questionIds.find(
				(q) => q._id === answer.questionId._id
			);
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
			if (isUnanswered) {
				return;
			}

			switch (question.type) {
				case 'multipleChoice': {
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
					break;
				}
				case 'trueFalse': {
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
					break;
				}
				case 'openText': {
					const normalizeText = (text) => {
						if (!text) return '';
						return text.toString().toLowerCase().trim();
					};
					const userText = normalizeText(
						Array.isArray(answer.selected)
							? answer.selected[0]
							: answer.selected
					);
					const correctText = normalizeText(question.correctAnswers);
					if (userText === correctText) {
						earnedPoints += questionPoints;
					}
					break;
				}
			}
		});

		return { earnedPoints, totalPoints };
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
					{filteredAnswers.length>0 ? filteredAnswers.map((answer) => {
						const { earnedPoints, totalPoints } = calculateScore(answer);
						return (
							<Link
								key={answer._id}
								to={`/quiz/results/${answer._id}`}
								className="answer"
							>
								<small>@{answer.userId.username}</small>
								<h5>{answer.userId.name}</h5>
								<p>
									Набрано баллов: {earnedPoints} из {totalPoints}
								</p>
							</Link>
						);
					}) : (
						<p>Ответов нет.</p>
					)}
				</div>
			</section>
		</main>
	);
};
