/* eslint-disable react/prop-types */
import 'react';
import { Link } from 'react-router-dom';

export const HomeCard = ({ title, questionsCount, tags, imageUrl }) => {
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
				<Link to="..." className="btn btn-pure">
					<span>Пройти</span>
					<img src="./assets/icons/arrow-right.png" alt=">" />
				</Link>
			</div>
		</article>
	);
};
