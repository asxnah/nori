import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Auth.css';

const Auth = () => {
	return (
		<div id="AuthPage">
			<main>
				<div id="left">
					<img src="./assets/logo/logo-white.svg" alt="логотип Nori" />
					<p>Создавайте, настраивайте и проходите викторины онлайн</p>
				</div>
				<form
					action="__auth.php"
					method="post"
					id="auth"
					className="card btn-pure"
				>
					<h1>Вход и регистрация</h1>
					<div id="inputs">
						<input
							type="text"
							id="username"
							className="btn"
							name="username"
							placeholder="Логин"
							required
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
							placeholder="Пароль"
							required
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
							type="submit"
							id="login"
							className="btn btn-pure"
							name="login"
						>
							Войти
						</button>
						<button
							type="submit"
							id="register"
							className="btn btn-dark"
							name="register"
						>
							Зарегистрироваться
						</button>
					</div>
					<small>
						Регистрируясь, Вы соглашаетесь с нашими
						<Link to="/about">
							политикой конфиденциальности и условиями предоставления услуг
						</Link>
						.
					</small>
				</form>
			</main>

			<section className="popup-con" id="no-such-user">
				<section className="popup card card-outline">
					<div className="heading">
						<h2>Такого пользователя не существует</h2>
						<button type="button" className="close-popup">
							<img
								src="./assets/icons/cross.png"
								alt="закрыть окно"
								title="закрыть окно"
							/>
						</button>
					</div>
					<div className="content">
						<p>
							Зарегистрируйтесь или проверьте правильность написания логина.
						</p>
					</div>
					<button type="button" className="btn btn-secondary close-popup">
						Отмена
					</button>
				</section>
			</section>

			<section className="popup-con" id="password-incorrect">
				<section className="popup card card-outline">
					<div className="heading">
						<p>Неверный пароль</p>
						<button type="button" className="close-popup">
							<img
								src="./assets/icons/cross.png"
								alt="закрыть окно"
								title="закрыть окно"
							/>
						</button>
					</div>
				</section>
			</section>
		</div>
	);
};

export default Auth;
