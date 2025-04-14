// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import './AuthPage.css';

export const AuthPage = () => {
	const [formData, setFormData] = useState({ username: '', password: '' });
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleLogin = async (evt) => {
		evt.preventDefault();

		if (!formData.username || !formData.password) {
			return setError('⚠️ Заполните все поля');
		}

		try {
			const response = await axios.post('http://localhost:3000/login', {
				username: formData.username,
				password: formData.password,
			});

			if (response.data.message) {
				setError(null);
				Cookies.set('user', formData.username, { expires: 30 });
				navigate('/user');
			} else {
				setError('⚠️ Проверьте правильность логина и пароля');
			}
		} catch (err) {
			console.error('Ошибка при входе:', err);
		}
	};

	const handleRegister = async (evt) => {
		evt.preventDefault();

		if (!formData.username || !formData.password) {
			return setError('⚠️ Заполните все поля');
		}

		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]+$/;
		const usernameRegex = /^[A-Za-z0-9_]+$/;

		if (!passwordRegex.test(formData.password)) {
			return setError('⚠️ Пароль должен соответствовать требованиям');
		}

		if (!usernameRegex.test(formData.username)) {
			return setError('⚠️ Логин должен соответствовать требованиям');
		}

		try {
			const response = await axios.post('http://localhost:3000/register', {
				username: formData.username,
				password: formData.password,
			});

			if (response.data.message) {
				setError(null);
				Cookies.set('user', formData.username, { expires: 30 });
				navigate('/user');
			} else {
				setError('⚠️ Пользователь с таким логином уже существует');
			}
		} catch (err) {
			console.error('Ошибка регистрации:', err);
		}
	};

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
						{error ? <p className="err">{error}</p> : null}
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
						<button id="login" className="btn btn-pure" onClick={handleLogin}>
							Войти
						</button>
						<button
							id="register"
							className="btn btn-dark"
							onClick={handleRegister}
						>
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
