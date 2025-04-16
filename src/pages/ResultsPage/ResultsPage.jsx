import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './ResultsPage.css';
import { TrueIcon } from './icons/TrueIcon';
import { FalseIcon } from './icons/FalseIcon';

export const ResultsPage = () => {
	const { testId } = useParams();
	const [test, setTest] = useState(null);
	const [userAnswers, setUserAnswers] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const testResponse = await axios.get(
					`http://localhost:3000/api/quizzes/${testId}`
				);
				setTest(testResponse.data);

				const userData = JSON.parse(Cookies.get('user'));
				if (!userData || !userData.id) {
					throw new Error('User data not found');
				}

				const answersResponse = await axios.get(
					`http://localhost:3000/api/quizzes/${testId}/answers/${userData.id}`
				);
				setUserAnswers(answersResponse.data);
			} catch (err) {
				console.error('Error fetching results:', err);
				setError('Ошибка при загрузке результатов');
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [testId]);

	if (loading) return <div>Загрузка результатов...</div>;
	if (error) return <div>{error}</div>;
	if (!test || !userAnswers) return <div>Результаты не найдены</div>;

	const calculateScore = () => {
		let correct = 0;
		let total = 0;

		userAnswers.answers.forEach((answer, index) => {
			const question = test.questionIds[index];
			console.log('Processing question:', {
				index,
				type: question.type,
				correctAnswer: question.correctAnswer,
				userAnswer: answer.selected,
				correctAnswerType: typeof question.correctAnswer,
				userAnswerType: typeof answer.selected[0],
			});

			// Считаем только trueFalse и multipleChoice
			if (question.type === 'trueFalse' || question.type === 'multipleChoice') {
				total++;

				if (question.type === 'trueFalse') {
					const userAnswerBool = answer.selected[0] === 'true';
					const isCorrect = userAnswerBool === question.correctAnswer;
					console.log('True/False comparison:', {
						questionId: question._id,
						correctAnswer: question.correctAnswer,
						userAnswer: answer.selected[0],
						userAnswerBool,
						isEqual: isCorrect,
					});
					if (isCorrect) {
						correct++;
						console.log('Correct answer found! Current score:', {
							correct,
							total,
						});
					}
				} else if (question.type === 'multipleChoice') {
					// Сравниваем первый элемент массива с правильным ответом
					const isCorrect = answer.selected[0] === question.correctAnswer;
					console.log('Multiple choice comparison:', {
						questionId: question._id,
						correctAnswer: question.correctAnswer,
						userAnswer: answer.selected[0],
						isEqual: isCorrect,
					});
					if (isCorrect) {
						correct++;
						console.log('Correct answer found! Current score:', {
							correct,
							total,
						});
					}
				}
			}
		});
		console.log('Final score:', { correct, total });
		return { correct, total };
	};

	const { correct, total } = calculateScore();

	const renderQuestion = (question, index) => {
		const userAnswer = userAnswers.answers[index];
		const isCorrect =
			JSON.stringify(userAnswer.selected) ===
			JSON.stringify(question.correctAnswer);

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
									className={`btn ${
										option === question.correctAnswer
											? 'correct'
											: userAnswer.selected.includes(option)
											? 'incorrect'
											: 'btn-secondary'
									}`}
									disabled
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
							<button>
								<TrueIcon
									fill={
										question.correctAnswer === true
											? '#2dc653'
											: userAnswer.selected[0] === 'true' && !isCorrect
											? '#eb0000'
											: '#323232'
									}
								/>
							</button>
							<button>
								<FalseIcon
									fill={
										question.correctAnswer === false
											? '#2dc653'
											: userAnswer.selected[0] === 'false' && !isCorrect
											? '#eb0000'
											: '#323232'
									}
								/>
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
						<table>
							<thead>
								<tr>
									<th>Ваш ответ</th>
									<th>Правильный ответ</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{userAnswer.selected[0]}</td>
									<td>{question.correctAnswer}</td>
								</tr>
							</tbody>
						</table>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div>
			<main id="ResultsPage">
				<section id="heading">
					<div>
						<p>
							Верных ответов: {correct} из {total}
						</p>
						<h1>{test.title}</h1>
					</div>
					<button>
						Скачать<span>DOCX</span>
					</button>
				</section>

				<section className="results">
					{test.questionIds.map((question, index) =>
						renderQuestion(question, index)
					)}
				</section>
			</main>
		</div>
	);
};
