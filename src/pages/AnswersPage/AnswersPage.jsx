import { Link } from 'react-router-dom';
import './AnswersPage.css';
import { SearchIcon } from '../../uikit/SearchIcon/SearchIcon';
export const AnswersPage = () => {
	return (
		<main id="AnswersPage">
			<section id="heading">
				<h2>Насколько ты знаешь HTML?</h2>
				<p>Ответы пользователей</p>
			</section>

			<section id="answers">
				<div id="search" className="btn">
					<input
						type="text"
						id="searchbar"
						placeholder="Введите имя пользователя"
					/>
					<button id="go">
						<SearchIcon />
					</button>
				</div>

				<div id="answers-list">
					<Link to="..." className="answer">
						<small>@shivan</small>
						<h5>Шерстобитов Иван</h5>
						<p>Верных ответов: 5 из 20</p>
					</Link>
					<Link to="..." className="answer">
						<small>@garaul</small>
						<h5>Гасымов Раул</h5>
						<p>Верных ответов: 10 из 20</p>
					</Link>
					<Link to="..." className="answer">
						<small>@ipdarya</small>
						<h5>Ипанова Дарья</h5>
						<p>Верных ответов: 20 из 20</p>
					</Link>
				</div>
			</section>
		</main>
	);
};
