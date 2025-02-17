import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Preview.css';

const Preview = () => {
	return (
		<main id="PreviewPage">
			<div id="logo">
				<img src="./assets/logo/logo-black.svg" alt="логотип ОНИКС" />
			</div>

			<section>
				<h1>
					Веб-платформа для создания и проведения интерактивных викторин "Nori"
				</h1>
				<p>
					Проект предназначен для учеников, студентов, учителей и
					преподавателей, а также для личного использования
				</p>
			</section>

			<Link to="/" className="btn btn-primary">
				Перейти
			</Link>

			<section id="info">
				<h3>Разработчик</h3>
				<p>
					студентка группы 1-ИС <br />
					Черепанова Софья Юрьевна
				</p>
				<h3>Специальность</h3>
				<p>
					09.02.07 Информационные системы и программирование <br />
					ГБПОУ "ПКК "ОНИКС"
				</p>
			</section>

			<small>Пермь 2025</small>
		</main>
	);
};

export default Preview;
