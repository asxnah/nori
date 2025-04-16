/* eslint-disable react/prop-types */
import 'react';
import { Link } from 'react-router-dom';
import { ShareIcon } from '../pages/UserPage/icons/ShareIcon';
import { OpenIcon } from '../pages/UserPage/icons/OpenIcon';
import { EditIcon } from '../pages/UserPage/icons/EditIcon';
import { ArrowRightIcon } from '../uikit/ArrowRightIcon/ArrowRightIcon';

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
						<Link to={`/answers?id=${id}`} className="btn btn-pure">
							<span>Ответы пользователей</span>
							<span>
								<ArrowRightIcon />
							</span>
						</Link>
						<button>Удалить</button>
					</div>
				</div>
			</article>
		</>
	);
};

export default UserCreatedCard;
