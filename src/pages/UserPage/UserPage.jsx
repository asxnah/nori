// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import { CrossIcon } from '../../uikit/CrossIcon/CrossIcon';

import './UserPage.css';

import UserCreatedCard from '../../components/UserCreatedCard';

export const UserPage = () => {
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
	const user = {
		name: 'user',
		username: 'username',
	};

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
						<button className="faded-text">Выйти из аккаунта</button>
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
				<form className="popup card card-outline">
					<div className="heading">
						<h2>Редактирование профиля</h2>
						<button type="button" className="close-popup">
							<CrossIcon />
						</button>
					</div>
					<div className="content">
						<input
							type="text"
							id="new_name"
							className="btn"
							name="new_name"
							autoComplete="name"
							placeholder="Имя"
						/>
						<input
							type="text"
							id="new_username"
							className="btn"
							name="new_username"
							autoComplete="username"
							placeholder="Логин"
						/>
						<input
							type="password"
							id="new_password"
							className="btn"
							name="new_password"
							autoComplete="new-password"
							placeholder="Новый пароль (необязательно)"
						/>
						<input
							type="password"
							id="current_password"
							className="btn"
							name="current_password"
							autoComplete="current-password"
							placeholder="Старый пароль"
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
