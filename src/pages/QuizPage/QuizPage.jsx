import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './QuizPage.css';
import { TrueIcon } from './icons/TrueIcon';
import { FalseIcon } from './icons/FalseIcon';

export const QuizPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const testId = searchParams.get('id');
	const [test, setTest] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [answers, setAnswers] = useState({});
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!testId) {
			setError('ID теста не указан');
			setLoading(false);
			return;
		}

		const fetchTest = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/quizzes/${testId}`
				);
				setTest(response.data);
				setLoading(false);
			} catch (err) {
				console.error(err);
				setError('Ошибка при загрузке теста');
				setLoading(false);
			}
		};

		fetchTest();
	}, [testId]);

	const handleAnswer = (questionId, answer) => {
		setAnswers((prevAnswers) => {
			const newAnswers = { ...prevAnswers, [questionId]: answer };
			return newAnswers;
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);

		try {
			const userData = Cookies.get('user');
			if (!userData) {
				setError('Пользователь не авторизован');
				setSubmitting(false);
				return;
			}

			const { id: userId } = JSON.parse(userData);
			if (!userId) {
				setError('ID пользователя не найден');
				setSubmitting(false);
				return;
			}

			const formattedAnswers = Object.entries(answers)
				.filter(([key]) => !key.endsWith('_index'))
				.map(([questionId, answer]) => {
					const question = test.questionIds.find((q) => q._id === questionId);
					let formattedAnswer;

					switch (question.type) {
						case 'multipleChoice':
							formattedAnswer = [Number(answer)];
							break;
						case 'trueFalse':
							formattedAnswer = answer;
							break;
						case 'openText':
							formattedAnswer = answer;
							break;
						default:
							formattedAnswer = answer;
					}

					return {
						questionId,
						selected: formattedAnswer,
					};
				});

			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/quizzes/${testId}/answers`,
				{
					userId,
					answers: formattedAnswers,
				}
			);

			navigate(`/quiz/results/${response.data.userAnswer._id}`);
		} catch (err) {
			console.error(err);
			setError('Ошибка при сохранении ответов');
			setSubmitting(false);
		}
	};

	const renderQuestion = (question, index) => {
		switch (question.type) {
			case 'multipleChoice':
				return (
					<div className="question" key={question._id}>
						<div className="question-text">
							<div className="question-number">{index + 1}</div>
							<p>{question.questionText}</p>
						</div>
						<div className="answers multipleChoice">
							{question.options.map((option, i) => (
								<button
									key={i}
									type="button"
									className={`btn ${
										answers[question._id] === i
											? 'btn-primary'
											: 'btn-secondary'
									}`}
									onClick={() => handleAnswer(question._id, i)}
								>
									{option}
								</button>
							))}
						</div>
					</div>
				);
			case 'trueFalse':
				return (
					<div className="question" key={question._id}>
						<div className="question-text">
							<div className="question-number">{index + 1}</div>
							<p>{question.questionText}</p>
						</div>
						<div className="answers trueFalse">
							<button
								type="button"
								className={answers[question._id] === true ? 'selected' : ''}
								onClick={() => handleAnswer(question._id, true)}
							>
								<TrueIcon isSelected={answers[question._id] === true} />
							</button>
							<button
								type="button"
								className={answers[question._id] === false ? 'selected' : ''}
								onClick={() => handleAnswer(question._id, false)}
							>
								<FalseIcon isSelected={answers[question._id] === false} />
							</button>
						</div>
					</div>
				);
			case 'openText':
				return (
					<div className="question" key={question._id}>
						<div className="question-text">
							<div className="question-number">{index + 1}</div>
							<p>{question.questionText}</p>
						</div>
						<textarea
							value={answers[question._id] || ''}
							onChange={(e) => handleAnswer(question._id, e.target.value)}
							placeholder="Введите ваш ответ"
						/>
					</div>
				);
			default:
				return null;
		}
	};

	if (loading) {
		return <div>Загрузка теста...</div>;
	}

	if (error) {
		return <div>{error}</div>;
	}

	if (!test || !test.questionIds?.length) {
		return <div>Тест не найден</div>;
	}

	return (
		<div>
			<main id="QuizPage">
				<section id="heading">
					<div>
						<p>
							{Math.round(
								(Object.keys(answers).filter((key) => !key.endsWith('_index'))
									.length /
									test.questionIds.length) *
									100
							)}
							% пройдено
						</p>
						<h1>{test.title}</h1>
					</div>
					{test.description && <p>{test.description}</p>}
				</section>
				<form className="questions" onSubmit={handleSubmit}>
					{test.questionIds.map((question, index) =>
						renderQuestion(question, index)
					)}
					<button
						type="submit"
						className="btn btn-primary"
						disabled={
							submitting ||
							Object.keys(answers).filter((key) => !key.endsWith('_index'))
								.length !== test.questionIds.length
						}
					>
						{submitting ? 'Сохранение...' : 'Завершить прохождение'}
					</button>
				</form>
			</main>
		</div>
	);
};
