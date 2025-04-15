import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Header.css';

export const Header = () => {
	const isAuthenticated = Cookies.get('isAuthenticated');

	return (
		<header>
			<Link to="/" aria-labelledby="ссылка на главную страницу">
				<img src="./assets/logo/logo-black.svg" alt="логотип Nori" />
			</Link>
			<nav>
				{isAuthenticated && (
					<Link to="/create" className="btn btn-secondary">
						Создать
					</Link>
				)}
				{!isAuthenticated && (
					<Link to="/auth" className="btn btn-primary">
						Войти
					</Link>
				)}
				{isAuthenticated && (
					<Link
						to="/user"
						title="профиль пользователя (личный кабинет)"
						aria-labelledby="ссылка на профиль пользователя (личный кабинет)"
					>
						&#128100;
					</Link>
				)}
			</nav>
		</header>
	);
};
