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

	useEffect(() => {
		if (Cookies.get('banner_hidden') === 'true') {
			setBannerVisible(false);
		} else {
			setBannerVisible(true);
		}

		const fetchQuizzes = async () => {
			try {
				const response = await axios.get(
					`${import.meta.env.VITE_API_URL}/api/quizzes`
				);
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

	const handleSearch = (e) => {
		setSearchTerm(e.target.value.toLowerCase());
	};

	const filteredQuizzes = quizzes.filter((quiz) => {
		const searchLower = searchTerm.toLowerCase();
		const titleMatch = quiz.title.toLowerCase().includes(searchLower);
		const tagsMatch = quiz.tags.some((tag) =>
			tag.toLowerCase().includes(searchLower)
		);
		return titleMatch || tagsMatch;
	});

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
						{filteredQuizzes.map((quiz) => (
							<QuizCard
								key={quiz._id}
								id={quiz._id}
								title={quiz.title}
								questionsCount={quiz.questionIds.length}
								tags={quiz.tags}
								background={quiz.background}
							/>
						))}
					</div>
				)}
			</section>
		</main>
	);
};
