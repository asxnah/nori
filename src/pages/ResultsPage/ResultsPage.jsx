import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ResultsPage.css';
import { TrueIcon } from './icons/TrueIcon';
import { FalseIcon } from './icons/FalseIcon';

export const ResultsPage = () => {
	const { answerId } = useParams();
	const [test, setTest] = useState(null);
	const [userAnswers, setUserAnswers] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchResults = async () => {
			try {
				const answersResponse = await axios.get(
					`http://localhost:3000/api/quizzes/answers/${answerId}`
				);
				setUserAnswers(answersResponse.data);

				const testResponse = await axios.get(
					`http://localhost:3000/api/quizzes/${answersResponse.data.testId}`
				);
				setTest(testResponse.data);
			} catch (err) {
				console.error('Error fetching results:', err);
				setError('Ошибка при загрузке результатов');
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [answerId]);

	if (loading) return <div>Загрузка результатов...</div>;
	if (error) return <div>{error}</div>;
	if (!test || !userAnswers) return <div>Результаты не найдены</div>;

	const calculateScore = () => {
		let correct = 0;
		let total = 0;

		userAnswers.answers.forEach((answer) => {
			const question = test.questionIds.find((q) => {
				return q._id === answer.questionId._id;
			});

			if (!question) return;

			total++; 

			if (question.type === 'trueFalse') {
				const userAnswerBool = answer.selected[0] === 'true';
				const isCorrect = userAnswerBool === question.correctAnswer;

				if (isCorrect) {
					correct++;
				}
			} else if (question.type === 'multipleChoice') {
				const isCorrect = answer.selected[0] === question.correctAnswer;

				if (isCorrect) {
					correct++;
				}
			} else if (question.type === 'openText') {
				const isCorrect =
					answer.selected[0].toLowerCase().trim() ===
					question.correctAnswer.toLowerCase().trim();

				if (isCorrect) {
					correct++;
				}
			}
		});

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
									<th>Ответ</th>
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
