/* eslint-disable react/prop-types */
import 'react';
import { Link } from 'react-router-dom';
import { ShareIcon } from '../pages/UserPage/icons/ShareIcon';
import { OpenIcon } from '../pages/UserPage/icons/OpenIcon';
import { EditIcon } from '../pages/UserPage/icons/EditIcon';
import { ArrowRightIcon } from '../uikit/ArrowRightIcon/ArrowRightIcon';

export const QuizCard = ({
	id,
	title,
	questionsCount,
	tags,
	imageUrl,
	type = 'default',
	correctAnswers,
	totalAnswers,
}) => {
	const style = {
		background: `linear-gradient(to left, var(--black-high), var(--black-high)), url(${imageUrl})`,
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
							<button>
								<EditIcon />
							</button>
							<Link to={`/quiz?id=${id}`}>
								<OpenIcon />
							</Link>
							<button
								onClick={() => {
									const url = `${window.location.origin}/quiz?id=${id}`;
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
							<Link to={`/quiz/results/${id}`}>
								<OpenIcon />
							</Link>
							<button
								onClick={() => {
									const url = `${window.location.origin}/quiz/results/${id}`;
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
									const url = `${window.location.origin}/quiz?id=${id}`;
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
						<Link to="/" className="btn btn-pure">
							<span>Скачать</span>
							<span>DOCX</span>
						</Link>
						<Link to={`/answers?id=${id}`} className="btn btn-pure">
							<span>Ответы пользователей</span>
							<span>
								<ArrowRightIcon />
							</span>
						</Link>
						<button>Удалить</button>
					</div>
				);
			case 'completed':
				return (
					<div className="quiz-footer">
						<Link to="/" className="btn btn-pure">
							<span>Скачать</span>
							<span>DOCX</span>
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
			{renderHeader()}
			<div className="content">
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
