import 'react';
import './ResultsPage.css';
import { TrueIcon } from './icons/TrueIcon';
import { FalseIcon } from './icons/FalseIcon';

export const ResultsPage = () => {
	const total = 2;
	const correct = 1;

	const incorrectColor = '#eb0000';
	const correctColor = '#2dc653';

	return (
		<div>
			<main id="ResultsPage">
				<section id="heading">
					<div>
						<p>
							Верных ответов: {correct} из {total}
						</p>
						<h1>Насколько ты знаешь HTML?</h1>
					</div>
					<button>
						Скачать<span>DOCX</span>
					</button>
				</section>

				<section className="results">
					<div className="question">
						<div className="question-text">
							<div className="question-number">1</div>
							<p>
								Какой из перечисленных тегов используется для создания
								гиперссылки?
							</p>
						</div>
						<div className="answers multipleChoice">
							<button className="btn correct" disabled>
								&lt;a&gt;
							</button>
							<button className="btn btn-secondary" disabled>
								&lt;href&gt;
							</button>
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
								<TrueIcon fill={correctColor} />
							</button>
							<button>
								<FalseIcon fill={incorrectColor} />
							</button>
						</div>
					</div>

					<div className="question">
						<div className="question-text">
							<div className="question-number">3</div>
							<p>Напишите тег для вставки изображения на веб-страницу</p>
						</div>
						<p>&lt;img&gt;</p>
					</div>
				</section>
			</main>
		</div>
	);
};
