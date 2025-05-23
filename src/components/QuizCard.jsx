/* eslint-disable react/prop-types */
import 'react';
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
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
	const [text, setText] = useState('Поделиться результатом');

	function fallbackCopyTextToClipboard(text) {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			const successful = document.execCommand('copy');
			alert(
				successful
					? 'Скопировано через fallback!'
					: 'Не удалось скопировать через fallback'
			);
		} catch (err) {
			alert('Ошибка копирования: ' + err);
		}

		document.body.removeChild(textArea);
	}

	function copyText(text) {
		if (navigator.clipboard) {
			navigator.clipboard
				.writeText(text)
				.then(() => alert('Ссылка скопирована!'))
				.catch(() => fallbackCopyTextToClipboard(text));
		} else {
			fallbackCopyTextToClipboard(text);
		}
	}

	const renderHeader = () => {
		switch (type) {
			case 'created':
				return (
					<div className="quiz-header">
						<p>Количество вопросов: {questionsCount}</p>
						<div className="group">
							{/* <Link to={`/create?id=${id}`}>
								<EditIcon />
							</Link> */}
							<Link to={`/quiz?id=${id}`}>
								<OpenIcon />
							</Link>
							<button
								onClick={() => {
									const url = `${import.meta.env.VITE_API_URL}/quiz?id=${id}`;
									copyText(url);
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
							Набрано баллов: {correctAnswers} из {totalAnswers}
						</p>
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
									console.error('CATCH Ошибка генерации PDF:', error);
									alert('Ошибка генерации PDF');
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
						<button
							className="btn btn-pure"
							onClick={() => {
								const url = `${
									import.meta.env.VITE_API_URL
								}/quiz/results/${id}`;
								navigator.clipboard.writeText(url);
								setText('Ссылка скопирована');
								setTimeout(() => {
									setText('Поделиться результатом');
								}, 2000);
							}}
						>
							<span>{text}</span>
							<span>
								<ShareIcon />
							</span>
						</button>
						<Link className="btn btn-pure" to={`/quiz/results/${link}`}>
							<span>Открыть</span>
							<span>
								<OpenIcon />
							</span>
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
