/* eslint-disable react/prop-types */
import 'react';
import { Link } from 'react-router-dom';

export const UserCreatedCard = ({
	id,
	title,
	questionsCount,
	tags,
	imageUrl,
}) => {
	const style = {
		background: `linear-gradient(to left, var(--black-high), var(--black-high)), url(${imageUrl})`,
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center',
	};

	return (
		<>
			<article className="card quiz" style={style}>
				<div className="quiz-header">
					<p>{questionsCount} вопросов</p>
					<div className="group">
						<button>
							<img
								src="/assets/icons/pencil.png"
								alt="редактировать викторину"
								aria-labelledby="редактировать викторину"
								title="редактировать"
							/>
						</button>
						<Link to={`/quiz?id=${id}`}>
							<img
								src="/assets/icons/open-link.png"
								alt="открыть викторину"
								aria-labelledby="открыть викторину"
								title="открыть"
							/>
						</Link>
						<button>
							<img
								src="/assets/icons/share.png"
								alt="поделиться викториной"
								aria-labelledby="поделиться викториной"
								title="поделиться"
							/>
						</button>
					</div>
				</div>
				<div className="content">
					<h1>{title}</h1>
					<div className="tags">
						{tags.map((tag, index) => (
							<p key={index}>{tag}</p>
						))}
					</div>
					<div className="quiz-footer">
						<Link to={`/download/${id}`} className="btn btn-pure">
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
