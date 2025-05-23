// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import QuizCard from '../../components/QuizCard';
import { Banner } from '../../components/Banner/Banner';
import { SearchIcon } from '../../uikit/SearchIcon/SearchIcon';
import './MainPage.css';

export const MainPage = () => {
	const [isBannerVisible, setBannerVisible] = useState(true);
	const [quizzes, setQuizzes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const fetchQuizzes = async (searchQuery = '') => {
		try {
			setLoading(true);
			const response = await axios.get(
				`${import.meta.env.VITE_API_URL}/api/quizzes${
					searchQuery ? `?search=${searchQuery}` : ''
				}`
			);
			setQuizzes(response.data);
			setLoading(false);
		} catch (error) {
			console.error('CATCH Ошибка при загрузке викторин >> ', error);
			setError('Ошибка при загрузке викторин');
			setLoading(false);
		}
	};

	useEffect(() => {
		if (Cookies.get('banner_hidden') === 'true') {
			setBannerVisible(false);
		} else {
			setBannerVisible(true);
		}

		fetchQuizzes();
	}, []);

	const removeBanner = () => {
		const startPosition = window.scrollY;
		const targetElement = document.querySelector('#quizzes');
		const targetPosition = targetElement.offsetTop;
		const distance = targetPosition - startPosition - 50;
		const duration = 1000;
		const startTime = performance.now();

		function scrollAnimation(currentTime) {
			const elapsedTime = currentTime - startTime;
			const progress = Math.min(elapsedTime / duration, 1);

			const easeInOutCubic = (progress) => {
				return progress < 0.5
					? 4 * progress * progress * progress
					: 1 - Math.pow(-2 * progress + 2, 3) / 2;
			};

			window.scrollTo(0, startPosition + distance * easeInOutCubic(progress));

			if (progress < 1) {
				requestAnimationFrame(scrollAnimation);
			} else {
				Cookies.set('banner_hidden', 'true', { expires: 30 });
				setBannerVisible(false);
			}
		}

		requestAnimationFrame(scrollAnimation);
	};

	const handleSearch = (e) => {
		const value = e.target.value.toLowerCase();
		setSearchTerm(value);
		fetchQuizzes(value);
	};

	return (
		<main id="MainPage">
			{isBannerVisible && <Banner onRemove={removeBanner} />}
			<section id="quizzes">
				<div id="search" className="btn">
					<input
						type="text"
						id="searchbar"
						placeholder="Введите название или тег"
						value={searchTerm}
						onChange={handleSearch}
					/>
					<button id="go">
						<SearchIcon />
					</button>
				</div>

				{loading ? (
					<p>Загрузка викторин...</p>
				) : error ? (
					<p>{error}</p>
				) : (
					<div id="quizzes-list">
						{quizzes.length > 0 ? quizzes.map((quiz) => (
							<QuizCard
								key={quiz._id}
								id={quiz._id}
								title={quiz.title}
								questionsCount={quiz.questionIds.length}
								tags={quiz.tags}
								background={quiz.background}
							/>
						)) : 
						(
							<p>По данному запросу викторины не найдены.</p>
						)}
					</div>
				)}
			</section>
		</main>
	);
};
