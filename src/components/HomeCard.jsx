/* eslint-disable react/prop-types */
import 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '../uikit/ArrowRightIcon/ArrowRightIcon';

export const HomeCard = ({ title, questionsCount, tags, imageUrl, id }) => {
	const style = {
		background: `linear-gradient(to left, var(--black-high), var(--black-high)), url(${imageUrl})`,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	};

	return (
		<article className="card quiz" style={style}>
			<div className="quiz-header">
				<p>{questionsCount} вопросов</p>
			</div>
			<div className="content">
				<h1>{title}</h1>
				<div className="tags">
					{tags.map((tag, index) => (
						<p key={index}>{tag}</p>
					))}
				</div>
				<Link to={`/quiz?id=${id}`} className="btn btn-pure">
					<span>Пройти</span>
					<ArrowRightIcon />
				</Link>
			</div>
		</article>
	);
};
