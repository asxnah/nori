import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
	return (
		<footer>
			<button
				id="top"
				aria-labelledby="кнопка пролистать наверх"
				title="пролистать наверх"
			>
				&#8593;
			</button>
			<Link to="/about">О платформе</Link>
			<small>
				© 2024-2025 Все права защищены — <b>Nori</b> — создавайте, настраивайте
				и проходите викторины онлайн
			</small>
		</footer>
	);
};
