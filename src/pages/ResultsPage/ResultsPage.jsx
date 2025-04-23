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

		userAnswers.answers.forEach((answer) => {
			const question = test.questionIds.find(
				(q) => q._id === answer.questionId._id
			);
			if (!question) return;
			total++;

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
						correct++;
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
						correct++;
					}
					break;
				}
				case 'openText': {
					const normalizeText = (text) => {
						if (!text) return '';
						return text.toString().toLowerCase().trim().replace(/\s+/g, ' ');
					};
					const userText = normalizeText(
						Array.isArray(answer.selected)
							? answer.selected[0]
							: answer.selected
					);
					const correctText = normalizeText(question.correctAnswers);
					if (userText === correctText) {
						correct++;
					}
					break;
				}
			}
		});

		return { correct, total };
	};

	const { correct, total } = calculateScore();

	const renderQuestion = (question, index) => {
		const userAnswer = userAnswers.answers[index];

		switch (question.type) {
			case 'multipleChoice': {
				const selectedAnswers = new Set(
					(Array.isArray(userAnswer.selected)
						? userAnswer.selected
						: [userAnswer.selected]
					).map((item) => (item === null ? null : Number(item)))
				);
				const correctAnswersSet = new Set(
					(Array.isArray(question.correctAnswers)
						? question.correctAnswers
						: [question.correctAnswers]
					).map(Number)
				);

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
										correctAnswersSet.has(i)
											? selectedAnswers.has(i)
												? 'correct'
												: 'correct-border btn-secondary'
											: selectedAnswers.has(i)
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
			}
			case 'trueFalse': {
				const selectedValue = Array.isArray(userAnswer.selected)
					? userAnswer.selected[0]
					: userAnswer.selected;

				const userBool =
					selectedValue === null || selectedValue === undefined
						? null
						: selectedValue === true || selectedValue === 'true';

				const correctBool =
					question.correctAnswers === true ||
					question.correctAnswers === 'true';

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
										userBool === null
											? correctBool
												? '#2dc653'
												: '#323232'
											: correctBool
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
										userBool === null
											? !correctBool
												? '#2dc653'
												: '#323232'
											: !correctBool
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
			}
			case 'openText': {
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
									<td>
										{userAnswer.selected[0] === null
											? '-'
											: userAnswer.selected[0]}
									</td>
									<td>{question.correctAnswers}</td>
								</tr>
							</tbody>
						</table>
					</div>
				);
			}
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
						Скачать<span>PDF</span>
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
