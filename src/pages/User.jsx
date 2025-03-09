// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import './styles/User.css';

import UserCreatedCard from '../components/UserCreatedCard';

const User = () => {
	const [user, setUser] = useState('');
	const getUserData = async () => {
		const response = await axios.post('http://localhost:3000/user', {
			username: Cookies.get('user'),
		});
		setUser(response.data);
	};
	getUserData();

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
				<form
					action="__edit_profile.php"
					method="post"
					className="popup card card-outline"
				>
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
						<input
							type="text"
							id="name"
							className="btn"
							name="name"
							placeholder="Имя"
						/>
						<input
							type="text"
							id="username"
							className="btn"
							name="username"
							placeholder="Логин"
						/>
						<input
							type="password"
							id="password_old"
							className="btn"
							name="password_old"
							placeholder="Старый пароль"
						/>
						<p className="faded-text">
							Старый пароль обязателен для сохранения редактирования профиля
						</p>
						<input
							type="password"
							id="password_new"
							className="btn"
							name="password_new"
							placeholder="Новый пароль"
						/>
						<p className="faded-text">
							Введите новый пароль, если меняете пароль
						</p>
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

export default User;
