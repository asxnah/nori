import 'react';
import './QuizPage.css';
import { TrueIcon } from './icons/TrueIcon';
import { FalseIcon } from './icons/FalseIcon';

export const QuizPage = () => {
	const percentage = 0;

	return (
		<div>
			<main id="QuizPage">
				<section id="heading">
					<div>
						<p>{percentage} % пройдено</p>
						<h1>Насколько ты знаешь HTML?</h1>
					</div>
					<p>Оставшееся время на выполнение: 15 мин</p>
				</section>
				<form className="questions">
					<div className="question">
						<div className="question-text">
							<div className="question-number">1</div>
							<p>
								Какой из перечисленных тегов используется для создания
								гиперссылки?
							</p>
						</div>
						<div className="answers multipleChoice">
							<button className="btn btn-secondary">&lt;a&gt;</button>
							<button className="btn btn-secondary">&lt;href&gt;</button>
						</div>
					</div>

					<div className="question">
						<div className="question-text">
							<div className="question-number">2</div>
							<p>
								Тег &lt;h1&gt; используется для создания заголовка первого
								уровня
							</p>
						</div>
						<div className="answers trueFalse">
							<button>
								<TrueIcon />
							</button>
							<button>
								<FalseIcon />
							</button>
						</div>
					</div>

					<div className="question">
						<div className="question-text">
							<div className="question-number">3</div>
							<p>Напишите тег для вставки изображения на веб-страницу</p>
						</div>
						<textarea
							id="openText"
							name="openText"
							placeholder="Ответ"
						></textarea>
					</div>

					<button type="submit" className="btn btn-primary">
						Завершить прохождение
					</button>
				</form>
			</main>
		</div>
	);
};
