import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
	return (
		<header>
			<Link to="/" aria-labelledby="ссылка на главную страницу">
				<img src="./assets/logo/logo-black.svg" alt="логотип Nori" />
			</Link>
			<nav>
				<Link to="/create" className="btn btn-secondary">
					Создать
				</Link>
				<Link to="/auth" className="btn btn-primary">
					Войти
				</Link>
				<Link
					to="/user"
					title="профиль пользователя (личный кабинет)"
					aria-labelledby="ссылка на профиль пользователя (личный кабинет)"
				>
					&#128100;
				</Link>
			</nav>
		</header>
	);
};
