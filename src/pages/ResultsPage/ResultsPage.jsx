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
					`${import.meta.env.VITE_API_URL}/api/quizzes/answers/${answerId}`
				);
				setUserAnswers(answersResponse.data);

				const testResponse = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/quizzes/${
						answersResponse.data.testId
					}`
				);
				setTest(testResponse.data);
			} catch (err) {
				console.error('Error fetching results >> ', err);
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
		let selectedNumber,
			userAnswer,
			correctAnswers,
			normalizeText,
			userText,
			correctText;

		userAnswers.answers.forEach((answer) => {
			const question = test.questionIds.find(
				(q) => q._id === answer.questionId._id
			);
			if (!question) return;
			total++;

			switch (question.type) {
				case 'multipleChoice':
					selectedNumber = Number(answer.selected[0]);
					if (selectedNumber === Number(question.correctAnswers)) {
						correct++;
					}
					break;
				case 'trueFalse':
					userAnswer =
						answer.selected === true ||
						answer.selected[0] === true ||
						answer.selected === 'true' ||
						answer.selected[0] === 'true';
					correctAnswers =
						question.correctAnswers === true ||
						question.correctAnswers === 'true';
					if (userAnswer === correctAnswers) {
						correct++;
					}
					break;
				case 'openText':
					normalizeText = (text) => {
						if (!text) return '';
						return text.toString().toLowerCase().trim().replace(/\s+/g, ' ');
					};
					userText = normalizeText(answer.selected[0] || answer.selected);
					correctText = normalizeText(question.correctAnswers);
					if (userText === correctText) {
						correct++;
					}
					break;
			}
		});

		return { correct, total };
	};

	const { correct, total } = calculateScore();

	const renderQuestion = (question, index) => {
		const userAnswer = userAnswers.answers[index];
		let selectedIndex, userBool, correctBool;

		switch (question.type) {
			case 'multipleChoice':
				selectedIndex = Number(userAnswer.selected[0]);
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
										i === Number(question.correctAnswers)
											? 'correct'
											: i === selectedIndex
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
				userBool =
					userAnswer.selected === true || userAnswer.selected[0] === true;
				correctBool = question.correctAnswers === true;
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
										correctBool
											? '#2dc653'
											: userBool && !correctBool
											? '#eb0000'
											: '#323232'
									}
								/>
							</button>
							<button>
								<FalseIcon
									fill={
										!correctBool
											? '#2dc653'
											: !userBool && correctBool
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
									<td>{question.correctAnswers}</td>
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
