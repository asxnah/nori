// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

import './AuthPage.css';

export const AuthPage = () => {
	const [formData, setFormData] = useState({ username: '', password: '' });
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		if (Cookies.get('isAuthenticated')) {
			navigate('/user');
		}
	}, [navigate]);

	const handleChange = (evt) => {
		const { name, value } = evt.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleLogin = async (evt) => {
		evt.preventDefault();
		setError('');
		setSuccess('');

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/login`,
				formData
			);

			setSuccess(response.data.message);
			Cookies.set('isAuthenticated', 'true', { expires: 30 });
			Cookies.set(
				'user',
				JSON.stringify({
					name: response.data.user.name || response.data.user.username,
					username: response.data.user.username,
					id: response.data.user.id,
				}),
				{ expires: 30 }
			);
			navigate('/user');
		} catch (err) {
			setError(err.response?.data?.message || 'Произошла ошибка');
		}
	};

	const handleRegister = async (evt) => {
		evt.preventDefault();
		setError('');
		setSuccess('');

		try {
			const response = await axios.post(
				`${import.meta.env.VITE_API_URL}/api/register`,
				formData
			);

			setSuccess(response.data.message);
			Cookies.set('isAuthenticated', 'true', { expires: 30 });
			Cookies.set(
				'user',
				JSON.stringify({
					name: response.data.user.name || response.data.user.username,
					username: response.data.user.username,
					id: response.data.user.id,
				}),
				{ expires: 30 }
			);
			navigate('/user');
		} catch (err) {
			setError(err.response?.data?.message || 'Произошла ошибка');
		}
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
					{error && <div className="error-message">{error}</div>}
					{success && <div className="success-message">{success}</div>}
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
						<button
							type="button"
							className="btn btn-pure"
							onClick={handleLogin}
						>
							Войти
						</button>
						<button
							type="button"
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
