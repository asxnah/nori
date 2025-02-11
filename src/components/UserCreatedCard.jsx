import React from 'react';
import { Link } from 'react-router-dom';

const UserCreatedCard = ({ title, questionsCount, tags, imageUrl }) => {
	const style = {
		background: `linear-gradient(to left, var(--black-high), var(--black-high)), url(${imageUrl})`,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	};

	return (
		<>
			<article class="card quiz" style={style}>
				<div class="quiz-header">
					<p>{questionsCount} вопросов</p>
					<div class="group">
						<a href="...">
							<img
								src="./assets/icons/pencil.png"
								alt="редактировать викторину"
								aria-labelledby="редактировать викторину"
								title="редактировать"
							/>
						</a>
						<a href="...">
							<img
								src="./assets/icons/open-link.png"
								alt="открыть викторину"
								aria-labelledby="открыть викторину"
								title="открыть"
							/>
						</a>
						<a href="...">
							<img
								src="./assets/icons/share.png"
								alt="поделиться викториной"
								aria-labelledby="поделиться викториной"
								title="поделиться"
							/>
						</a>
					</div>
				</div>
				<div class="content">
					<h1>{title}</h1>
					<div class="tags">
						{tags.map((tag, index) => (
							<p key={index}>{tag}</p>
						))}
					</div>
					<div class="quiz-footer">
						<Link to="..." class="btn btn-pure">
							<span>Скачать</span>
							<span>DOCX</span>
						</Link>
						<button>Удалить</button>
					</div>
				</div>
			</article>
		</>
	);
};

export default UserCreatedCard;
