import { Link } from 'react-router-dom';
import { ArrowUpIcon } from '../../uikit/ArrowUpIcon/ArrowUpIcon';
import './Footer.css';

export const Footer = () => {
	return (
		<footer>
			<button
				id="top"
				aria-labelledby="кнопка пролистать наверх"
				title="пролистать наверх"
				onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			>
				<ArrowUpIcon />
			</button>
			<Link to="/about">О платформе</Link>
			<small>
				© 2024-2025 Все права защищены — <b>Nori</b> — создавайте, настраивайте
				и проходите викторины онлайн
			</small>
		</footer>
	);
};
