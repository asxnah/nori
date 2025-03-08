// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import './styles/Home.css';

import HomeCard from '../components/HomeCard';
import Banner from '../components/Banner';

const Home = () => {
	const [isBannerVisible, setBannerVisible] = useState(true);
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
		if (Cookies.get('banner_hidden') === 'true') {
			setBannerVisible(false);
		}
	}, []);

	const removeBanner = () => {
		Cookies.set('banner_hidden', 'true', { expires: 30 });
	};

	return (
		<main id="HomePage">
			{isBannerVisible && <Banner onRemove={removeBanner} />}
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
