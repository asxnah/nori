// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CrossIcon } from '../../uikit/CrossIcon/CrossIcon';
import Cookies from 'js-cookie';
import axios from 'axios';
import { usePopup } from '../../contexts/PopupContext';

import './UserPage.css';

import UserCreatedCard from '../../components/UserCreatedCard';

export const UserPage = () => {
	const navigate = useNavigate();
	const { openPopup, closePopup } = usePopup();
	const [user, setUser] = useState({ name: '', username: '' });
	const [formData, setFormData] = useState({
		new_name: '',
		new_username: '',
		new_password: '',
		current_password: '',
	});
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	useEffect(() => {
		const userData = Cookies.get('user');
		if (userData) {
			try {
				// Try to parse as JSON first
				const parsedData = JSON.parse(userData);
				setUser({
					name: parsedData.name || parsedData.username || userData,
					username: parsedData.username || userData,
				});
			} catch {
				// If not JSON, use as is
				setUser({
					name: userData,
					username: userData,
				});
			}
		}
	}, []);

	const handleFormChange = (evt) => {
		const { name, value } = evt.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (evt) => {
		evt.preventDefault();
		setError('');
		setSuccess('');

		const hasChanges = Object.entries(formData).some(
			([key, value]) => key !== 'current_password' && value.trim() !== ''
		);

		if (!hasChanges) {
			closePopup();
			return;
		}

		if (!formData.current_password) {
			setError('Текущий пароль обязателен для изменений');
			return;
		}

		try {
			const response = await axios.post(
				'http://localhost:3000/api/update-profile',
				{
					...formData,
					current_password: formData.current_password,
				}
			);

			setSuccess('Профиль успешно обновлен');

			// Store user data properly
			const userData = {
				name: response.data.user.name || response.data.user.username,
				username: response.data.user.username,
			};
			Cookies.set('user', JSON.stringify(userData), { expires: 30 });

			setUser(userData);

			setTimeout(() => {
				setFormData({
					new_name: '',
					new_username: '',
					new_password: '',
					current_password: '',
				});
				closePopup();
			}, 1000);
		} catch (err) {
			setError(err.response?.data?.message || 'Произошла ошибка');
		}
	};

	const handleLogout = () => {
		Cookies.remove('isAuthenticated');
		Cookies.remove('user');
		navigate('/auth');
	};

	const openEditPopup = () => {
		openPopup(
			<form onSubmit={handleSubmit}>
				<div className="heading">
					<h2>Редактирование профиля</h2>
					<button type="button" className="close-popup" onClick={closePopup}>
						<CrossIcon />
					</button>
				</div>
				<div className="content">
					{error && <div className="error-message">{error}</div>}
					{success && <div className="success-message">{success}</div>}
					<input
						type="text"
						id="new_name"
						className="btn"
						name="new_name"
						autoComplete="name"
						placeholder="Имя"
						value={formData.new_name}
						onChange={handleFormChange}
					/>
					<input
						type="text"
						id="new_username"
						className="btn"
						name="new_username"
						autoComplete="username"
						placeholder="Логин"
						value={formData.new_username}
						onChange={handleFormChange}
					/>
					<input
						type="password"
						id="new_password"
						className="btn"
						name="new_password"
						autoComplete="new-password"
						placeholder="Новый пароль (необязательно)"
						value={formData.new_password}
						onChange={handleFormChange}
					/>
					<input
						type="password"
						id="current_password"
						className="btn"
						name="current_password"
						autoComplete="current-password"
						placeholder="Старый пароль"
						value={formData.current_password}
						onChange={handleFormChange}
					/>
				</div>
				<div className="group">
					<button type="submit" className="btn btn-primary">
						Сохранить
					</button>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={closePopup}
					>
						Отмена
					</button>
				</div>
			</form>
		);
	};

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
						<button className="btn btn-secondary" onClick={openEditPopup}>
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
								<Link to="...">Созданные</Link>
								<Link to="/create" className="btn btn-secondary">
									Создать
								</Link>
							</li>
							<li id="tab-completed" className="tab">
								<Link to="...">Пройденные</Link>
							</li>
						</ul>
						<hr />
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
		</div>
	);
};
