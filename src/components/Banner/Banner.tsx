import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

export const Banner = ({ onRemove }) => {
	const banner = useRef<HTMLDivElement>(null);

	const scrollToQuizzes = () => {
		window.scrollTo({
			top: banner.current?.offsetHeight,
			behavior: 'smooth',
		});
	};

	return (
		<section id="banner" ref={banner}>
			<div id="left">
				<img src="./assets/logo/logo-white.svg" alt="логотип Nori" />
				<p>Создавайте, настраивайте и проходите викторины онлайн</p>
				<div className="group">
					<Link to="/create" className="btn btn-pure">
						Создать
					</Link>
					<button
						id="take-quiz"
						className="btn btn-dark"
						onClick={scrollToQuizzes}
					>
						Пройти
					</button>
				</div>
			</div>
			<div id="right" className="card btn-pure">
				<h2>Как это происходит?</h2>
				<div className="content">
					<p>
						Создайте викторину — выбирайте разные типы вопросов, добавляйте фон
						к вашей викторине, ставьте таймер прохождения.
					</p>
					<p>
						<span>ИЛИ</span>
					</p>
					<p>
						Пройдите викторину — оцените свои знания и получите результаты сразу
						после завершения.
					</p>
				</div>
				<button
					id="remove-banner"
					className="btn btn-pure"
					onClick={() => {
						onRemove();
					}}
				>
					Понятно, спасибо!
				</button>
			</div>
		</section>
	);
};
