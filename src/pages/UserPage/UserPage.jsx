// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import './UserPage.css';

import UserCreatedCard from '../../components/UserCreatedCard';

// return setError(response.data.message); НЕ РАБОТАЕТ (E.G. НЕ ТОТ ПАРОЛЬ)

export const UserPage = () => {
	const [user, setUser] = useState('');
	const getUserData = async () => {
		const response = await axios.post('http://localhost:3000/user', {
			username: Cookies.get('user'),
		});
		return setUser(response.data);
	};
	useEffect(() => {
		getUserData();
	}, []);

	const [error, setError] = useState(null);
	const [formData, setFormData] = useState({
		new_name: '',
		new_username: '',
		new_password: '',
		current_password: '',
	});
	const handleChange = (evt) => {
		const { name, value } = evt.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleAccountEdit = async (evt) => {
		evt.preventDefault();
		if (!formData.current_password) {
			return setError('⚠️ Введите пароль для редактирования аккаунта');
		} else if (
			!formData.new_name &&
			!formData.new_username &&
			!formData.new_password
		) {
			return setError('⚠️ Изменения не заданы');
		} else {
			if (formData.new_password) {
				const passwordRegex =
					/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/;
				if (!passwordRegex.test(formData.password)) {
					return setError('⚠️ Пароль должен соответствовать требованиям');
				}
				const response = await axios.put('http://localhost:3000/account-edit', {
					username: Cookies.get('user'),
					current_password: formData.current_password,
					new_password: formData.new_password,
				});

				if (response.data.message) {
					setError(null);
					document.querySelector('.popup-con').classList.remove('show');
					document.querySelector('body').style.overflow = '';
				} else {
					return setError(response.data.message);
				}
			}
			if (formData.new_name) {
				const response = await axios.put('http://localhost:3000/account-edit', {
					username: Cookies.get('user'),
					current_password: formData.current_password,
					new_name: formData.new_name,
				});

				if (response.data.message) {
					setError(null);
					getUserData();
					document.querySelector('.popup-con').classList.remove('show');
					document.querySelector('body').style.overflow = '';
				} else {
					return setError(response.data.message);
				}
			}
			if (formData.new_username) {
				const usernameRegex = /^[A-Za-z0-9_]+$/;
				if (!usernameRegex.test(formData.new_username)) {
					return setError('⚠️ Логин должен соответствовать требованиям');
				}

				const response = await axios.put('http://localhost:3000/account-edit', {
					username: Cookies.get('user'),
					current_password: formData.current_password,
					new_username: formData.new_username,
				});

				if (response.data.message) {
					setError(null);
					getUserData();
					document.querySelector('.popup-con').classList.remove('show');
					document.querySelector('body').style.overflow = '';
				} else {
					return setError(response.data.message);
				}
			}
		}
	};

	const navigate = useNavigate();
	const handleLogout = () => {
		Cookies.remove('user');
		navigate('/auth');
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
						<button className="btn btn-secondary open-popup">
							Редактировать аккаунт
						</button>
						<button onClick={handleLogout} className="faded-text">
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

			<section className="popup-con">
				<form onSubmit={handleAccountEdit} className="popup card card-outline">
					<div className="heading">
						<h2>Редактирование профиля</h2>
						<button type="button" className="close-popup">
							<img
								src="./assets/icons/cross.png"
								alt="закрыть окно"
								title="закрыть окно"
							/>
						</button>
					</div>
					<div className="content">
						{error ? <p className="err">{error}</p> : null}
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
							placeholder="Старый пароль"
							value={formData.current_password}
							onChange={handleChange}
						/>
					</div>
					<div className="group">
						<button type="submit" className="btn btn-primary">
							Сохранить
						</button>
						<button type="button" className="btn btn-secondary close-popup">
							Отмена
						</button>
					</div>
				</form>
			</section>
		</div>
	);
};
