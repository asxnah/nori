// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

import './MainPage.css';

import { HomeCard } from '../../components/HomeCard';
import { Banner } from '../../components/Banner/Banner';

export const MainPage = () => {
	const [isBannerVisible, setBannerVisible] = useState(true);
	const [quizzes, setQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (Cookies.get('banner_hidden') === 'true') {
			setBannerVisible(false);
		} else {
			setBannerVisible(true);
		}

		const fetchQuizzes = async () => {
			try {
				const response = await axios.get('http://localhost:3000/api/quizzes');
				setQuizzes(response.data);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching quizzes:', error);
				setError('Ошибка при загрузке викторин');
				setLoading(false);
			}
		};

		fetchQuizzes();
	}, []);

	const removeBanner = () => {
		Cookies.set('banner_hidden', 'true', { expires: 30 });
		setBannerVisible(false);
	};

	return (
		<main id="MainPage">
			{isBannerVisible && <Banner onRemove={removeBanner} />}
			<section id="quizzes">
				<div id="search" className="btn">
					<input type="text" id="searchbar" placeholder="JavaScript" />
					<button id="go">
						<img src="./assets/icons/search.png" alt="поиск" />
					</button>
				</div>

				{loading ? (
					<p>Загрузка викторин...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<div id="quizzes-list">
						{quizzes.map((quiz, index) => (
							<HomeCard
								key={index}
								title={quiz.title}
								questionsCount={quiz.questionIds.length}
								tags={quiz.tags}
								imageUrl={quiz.background}
								id={quiz._id}
							/>
						))}
					</div>
				)}
			</section>
		</main>
	);
};
