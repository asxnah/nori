/* eslint-disable react/prop-types */
import 'react';
import { Link } from 'react-router-dom';
import { ShareIcon } from '../pages/UserPage/icons/ShareIcon';
import { OpenIcon } from '../pages/UserPage/icons/OpenIcon';
import { EditIcon } from '../pages/UserPage/icons/EditIcon';
import { ArrowRightIcon } from '../uikit/ArrowRightIcon/ArrowRightIcon';
import axios from 'axios';
import { generateQuizPDF } from '../utils/pdfGenerator';

export const QuizCard = ({
	id,
	title,
	questionsCount,
	tags,
	background,
	type = 'default',
	correctAnswers,
	totalAnswers,
	link,
	onDelete,
}) => {
	const style = {
		background: background
			? `linear-gradient(to left, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${background})`
			: 'var(--color-primary)',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	};

	const renderHeader = () => {
		switch (type) {
			case 'created':
				return (
					<div className="quiz-header">
						<p>Количество вопросов: {questionsCount}</p>
						<div className="group">
							<Link to={`/create?id=${id}`}>
								<EditIcon />
							</Link>
							<Link to={`/quiz?id=${id}`}>
								<OpenIcon />
							</Link>
							<button
								onClick={() => {
									const url = `${import.meta.env.VITE_API_URL}/quiz?id=${id}`;
									navigator.clipboard.writeText(url);
								}}
							>
								<ShareIcon />
							</button>
						</div>
					</div>
				);
			case 'completed':
				return (
					<div className="quiz-header">
						<p>
							Правильных ответов: {correctAnswers} из {totalAnswers}
						</p>
						<div className="group">
							<Link to={`/quiz/results/${link}`}>
								<OpenIcon />
							</Link>
							<button
								onClick={() => {
									const url = `${
										import.meta.env.VITE_API_URL
									}/quiz/results/${id}`;
									navigator.clipboard.writeText(url);
								}}
							>
								<ShareIcon />
							</button>
						</div>
					</div>
				);
			default:
				return (
					<div className="quiz-header">
						<p>Количество вопросов: {questionsCount}</p>
						<div className="group">
							<Link to={`/quiz?id=${id}`}>
								<OpenIcon />
							</Link>
							<button
								onClick={() => {
									const url = `${import.meta.env.VITE_API_URL}/quiz?id=${id}`;
									navigator.clipboard.writeText(url);
								}}
							>
								<ShareIcon />
							</button>
						</div>
					</div>
				);
		}
	};

	const renderFooter = () => {
		switch (type) {
			case 'created':
				return (
					<div className="quiz-footer">
						<button
							className="btn btn-pure"
							onClick={async () => {
								try {
									const response = await axios.get(
										`${import.meta.env.VITE_API_URL}/api/quizzes/${id}`
									);
									await generateQuizPDF(response.data);
								} catch (error) {
									console.error('Error generating PDF:', error);
									alert('Failed to generate PDF');
								}
							}}
						>
							<span>Скачать</span>
							<span>PDF</span>
						</button>
						<Link to={`/answers?id=${id}`} className="btn btn-pure">
							<span>Ответы пользователей</span>
							<span>
								<ArrowRightIcon />
							</span>
						</Link>
						<button onClick={() => onDelete(id)}>Удалить</button>
					</div>
				);
			case 'completed':
				return (
					<div className="quiz-footer">
						<Link to="/" className="btn btn-pure">
							<span>Скачать</span>
							<span>PDF</span>
						</Link>
					</div>
				);
			default:
				return (
					<div className="quiz-footer">
						<Link to={`/quiz?id=${id}`} className="btn btn-pure">
							<span>Пройти</span>
							<span>
								<ArrowRightIcon />
							</span>
						</Link>
					</div>
				);
		}
	};

	return (
		<article className="card quiz" style={style}>
			<div className="content">
				{renderHeader()}
				<h3>{title}</h3>
				<div className="tags">
					{tags.map((tag, index) => (
						<p key={index}>{tag}</p>
					))}
				</div>
			</div>
			{renderFooter()}
		</article>
	);
};

export default QuizCard;
