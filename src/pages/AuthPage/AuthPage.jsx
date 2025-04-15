// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';

import './AuthPage.css';

export const AuthPage = () => {
	const [formData, setFormData] = useState({ username: '', password: '' });

	const handleChange = (evt) => {
		const { name, value } = evt.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	return (
		<div id="AuthPage">
			<main>
				<div id="left">
					<img src="./assets/logo/logo-white.svg" alt="логотип Nori" />
					<p>Создавайте, настраивайте и проходите викторины онлайн</p>
				</div>
				<form id="auth" className="card btn-pure">
					<h1>Вход и регистрация</h1>
					<div id="inputs">
						<input
							type="text"
							id="username"
							className="btn"
							name="username"
							autoComplete="username"
							placeholder="Логин"
							required
							value={formData.username}
							onChange={handleChange}
						/>
						<div className="form-text">
							<p>Логин может содержать:</p>
							<ul>
								<li>строчные и прописные латинские буквы</li>
								<li>цифры</li>
								<li>нижнее подчеркивание (_)</li>
							</ul>
						</div>
						<input
							type="password"
							id="password"
							className="btn"
							name="password"
							autoComplete="current-password"
							placeholder="Пароль"
							required
							value={formData.password}
							onChange={handleChange}
						/>
						<div className="form-text">
							<p>Пароль должен содержать:</p>
							<ul>
								<li>строчные и прописные латинские буквы</li>
								<li>минимум один (1) специальный символ</li>
								<li>минимум одну (1) цифру</li>
							</ul>
						</div>
					</div>

					<div className="group">
						<button id="login" className="btn btn-pure">
							Войти
						</button>
						<button id="register" className="btn btn-dark">
							Зарегистрироваться
						</button>
					</div>
					<small>
						Регистрируясь, Вы соглашаетесь с нашими&nbsp;
						<Link to="/about">
							политикой конфиденциальности и условиями предоставления услуг
						</Link>
						.
					</small>
				</form>
			</main>
		</div>
	);
};
