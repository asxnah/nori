import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';
import HomeCard from '../components/HomeCard';

const Home = () => {
	const quizzes = [
		{
			title: 'Насколько ты знаешь HTML',
			questionsCount: 10,
			tags: ['HTML', 'Web', 'Front-end'],
			imageUrl: './assets/quizzes/html.png',
		},
		{
			title: 'CSS: Тест на мастерство',
			questionsCount: 10,
			tags: ['CSS', 'Web', 'Front-end'],
			imageUrl: './assets/quizzes/css.png',
		},
		{
			title: 'React.js: Твой уровень',
			questionsCount: 10,
			tags: ['React.js', 'Web', 'Front-end'],
			imageUrl: './assets/quizzes/react.png',
		},
	];

	useEffect(() => {
		const banner = document.querySelector('#banner');
		const takeQuizButton = document.querySelector('#take-quiz');
		const removeBannerButton = document.querySelector('#remove-banner');

		if (localStorage.getItem('banner_hidden') === 'yes') {
			banner?.remove();
		} else {
			const handleTakeQuizClick = () => {
				window.scrollTo({
					top: banner?.offsetHeight,
					behavior: 'smooth',
				});
			};

			const handleRemoveBannerClick = () => {
				window.scrollTo({
					top: banner?.offsetHeight,
					behavior: 'smooth',
				});

				setTimeout(() => {
					banner?.remove();
				}, 500);

				localStorage.setItem('banner_hidden', 'yes');
			};

			takeQuizButton?.addEventListener('click', handleTakeQuizClick);
			removeBannerButton?.addEventListener('click', handleRemoveBannerClick);

			// Очистка обработчиков событий при размонтировании компонента
			return () => {
				takeQuizButton?.removeEventListener('click', handleTakeQuizClick);
				removeBannerButton?.removeEventListener(
					'click',
					handleRemoveBannerClick
				);
			};
		}
	}, []);

	return (
		<main id="HomePage">
			<section id="banner">
				<div id="left">
					<img src="./assets/logo/logo-white.svg" alt="логотип Nori" />
					<p>Создавайте, настраивайте и проходите викторины онлайн</p>
					<div className="group">
						<Link to="/create" className="btn btn-pure">
							Создать
						</Link>
						<button id="take-quiz" className="btn btn-dark">
							Пройти
						</button>
					</div>
				</div>
				<div id="right" className="card btn-pure">
					<h2>Как это происходит?</h2>
					<div className="content">
						<p>
							Создай викторину — загрузи свои вопросы и выбери параметры игры.
						</p>
						<p>
							<span>ИЛИ</span>
						</p>
						<p>
							Пройди викторину — оцени свои знания и получи результаты сразу
							после завершения.
						</p>
					</div>
					<button id="remove-banner" className="btn btn-pure">
						Понятно, спасибо!
					</button>
				</div>
			</section>

			<section id="quizzes">
				<div id="search" className="btn">
					<input type="text" id="searchbar" placeholder="JavaScript" />
					<button id="go">
						<img src="./assets/icons/search.png" alt="поиск" />
					</button>
				</div>

				<div id="quizzes-list">
					{quizzes.map((quiz, index) => (
						<HomeCard
							key={index}
							title={quiz.title}
							questionsCount={quiz.questionsCount}
							tags={quiz.tags}
							imageUrl={quiz.imageUrl}
						/>
					))}
				</div>
			</section>
		</main>
	);
};

export default Home;
