// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import './UserPage.css';

import UserCreatedCard from '../../components/UserCreatedCard';

export const UserPage = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState({ name: '', username: '' });
	const [isPopupVisible, setIsPopupVisible] = useState(false);
	const [formData, setFormData] = useState({
		new_name: '',
		new_username: '',
		new_password: '',
		current_password: '',
	});
	const [error, setError] = useState('');

	useEffect(() => {
		const userData = Cookies.get('user');
		if (userData) {
			try {
				const parsedData = JSON.parse(userData);
				setUser({
					name: parsedData.name || parsedData.username || userData,
					username: parsedData.username || userData,
				});
			} catch {
				setUser({
					name: userData,
					username: userData,
				});
			}
		}
	}, []);

	const handleLogout = () => {
		Cookies.remove('isAuthenticated');
		Cookies.remove('user');
		navigate('/auth');
	};

	const handleChange = (evt) => {
		const { name, value } = evt.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleShowPopup = () => {
		setIsPopupVisible(true);
	};

	const handleHidePopup = () => {
		setIsPopupVisible(false);
		setError('');
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		setError('');

		// Check if any changes were made
		const hasChanges = Object.entries(formData).some(([key, value]) => {
			if (key === 'current_password') return false;
			return value.trim() !== '';
		});

		if (!hasChanges) {
			handleHidePopup();
			return;
		}

		// Validate current password is provided for any changes
		if (!formData.current_password) {
			setError('Для внесения изменений необходимо ввести текущий пароль');
			return;
		}

		try {
			await axios.post('http://localhost:3000/api/update-profile', {
				...formData,
				current_username: user.username,
			});

			// Update user data in cookies
			const updatedUser = {
				name: formData.new_name || user.name,
				username: formData.new_username || user.username,
			};
			Cookies.set('user', JSON.stringify(updatedUser), { expires: 30 });

			// Update local state
			setUser(updatedUser);
			setFormData({
				new_name: '',
				new_username: '',
				new_password: '',
				current_password: '',
			});
			handleHidePopup();
		} catch (error) {
			setError(
				error.response?.data?.message ||
					'Произошла ошибка при обновлении профиля'
			);
		}
	};

	const quizzes = [
		{
			title: 'Насколько ты знаешь HTML',
			questionsCount: 10,
			tags: ['HTML', 'Web', 'Front-end'],
			imageUrl: '/assets/quizzes/html.png',
		},
		{
			title: 'CSS: Тест на мастерство',
			questionsCount: 10,
			tags: ['CSS', 'Web', 'Front-end'],
			imageUrl: '/assets/quizzes/css.png',
		},
		{
			title: 'React.js: Твой уровень',
			questionsCount: 10,
			tags: ['React.js', 'Web', 'Front-end'],
			imageUrl: '/assets/quizzes/react.png',
		},
	];

	return (
		<div id="UserPage">
			<main>
				<aside className="card card-outline">
					<section id="name">
						<p className="faded-text">@{user.username}</p>
						<h1>{user.name}</h1>
					</section>
					<hr />
					<section id="stats">
						<h3>Статистика</h3>
						<div className="group">
							<div className="group-el">
								<p>Пройдено</p>
								<hr />
								<p id="completed" className="counter">
									0
								</p>
							</div>
							<div className="group-el">
								<p>Создано</p>
								<hr />
								<p id="created" className="counter">
									0
								</p>
							</div>
						</div>
						<hr />
						<button className="btn btn-secondary" onClick={handleShowPopup}>
							Редактировать аккаунт
						</button>
						<button className="faded-text" onClick={handleLogout}>
							Выйти из аккаунта
						</button>
					</section>
				</aside>

				<div id="quizzes">
					<menu>
						<ul id="tabs">
							<li id="tab-created" className="tab active">
								<Link to="/user/created">Созданные</Link>
								<Link to="/create" className="btn btn-secondary">
									Создать
								</Link>
							</li>
							<li id="tab-completed" className="tab">
								<Link to="/user/completed">Пройденные</Link>
							</li>
						</ul>
					</menu>

					<div id="quizzes-list">
						{quizzes.map((quiz, index) => (
							<UserCreatedCard
								key={index}
								title={quiz.title}
								questionsCount={quiz.questionsCount}
								tags={quiz.tags}
								imageUrl={quiz.imageUrl}
							/>
						))}
					</div>
				</div>
			</main>

			<section className={`popup-con ${isPopupVisible ? 'show' : ''}`}>
				<form className="popup card card-outline" onSubmit={handleSubmit}>
					<div className="heading">
						<h2>Редактирование профиля</h2>
						<button type="button" onClick={handleHidePopup}>
							<img
								src="./assets/icons/cross.png"
								alt="закрыть окно"
								title="закрыть окно"
							/>
						</button>
					</div>
					<div className="content">
						{error && <div className="error-message">{error}</div>}
						<input
							type="text"
							id="new_name"
							className="btn"
							name="new_name"
							autoComplete="name"
							placeholder="Имя"
							value={formData.new_name}
							onChange={handleChange}
						/>
						<input
							type="text"
							id="new_username"
							className="btn"
							name="new_username"
							autoComplete="username"
							placeholder="Логин"
							value={formData.new_username}
							onChange={handleChange}
						/>
						<input
							type="password"
							id="new_password"
							className="btn"
							name="new_password"
							autoComplete="new-password"
							placeholder="Новый пароль (необязательно)"
							value={formData.new_password}
							onChange={handleChange}
						/>
						<input
							type="password"
							id="current_password"
							className="btn"
							name="current_password"
							autoComplete="current-password"
							placeholder="Текущий пароль"
							value={formData.current_password}
							onChange={handleChange}
						/>
					</div>
					<div className="group">
						<button type="submit" className="btn btn-primary">
							Сохранить
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={handleHidePopup}
						>
							Отмена
						</button>
					</div>
				</form>
			</section>
		</div>
	);
};
