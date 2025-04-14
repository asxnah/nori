// eslint-disable-next-line no-unused-vars
import React from 'react';
import './QuizPage.css';

export const QuizPage = () => {
	return (
		<main id="QuizPage">
			<form action="__create.php" method="post">
				<section id="info" className="card card-outline">
					<div id="heading">
						<h2>О викторине</h2>
						<div className="faded-text" id="remove-bg-btn" tabIndex="0">
							Удалить фон
						</div>
					</div>
					<div id="upload">
						<div id="upload-overlay">
							<img
								src="./assets/icons/upload.png"
								id="upload-icon"
								alt="иконка загрузки"
							/>
							<p>Загрузить фон</p>
						</div>
						<input type="file" name="cover" id="cover" accept="image/*" />
					</div>
					<div className="group">
						<input
							type="text"
							id="title"
							name="title"
							className="btn"
							placeholder="Название"
						/>
						<textarea
							name="description"
							id="description"
							placeholder="Описание"
						></textarea>
						<div id="tags">
							<input
								type="text"
								id="tag-1"
								className="tag btn"
								name="tag-1"
								placeholder="Тег"
							/>
							<input
								type="text"
								id="tag-2"
								className="tag btn"
								name="tag-2"
								placeholder="Тег"
							/>
							<input
								type="text"
								id="tag-3"
								className="tag btn"
								name="tag-3"
								placeholder="Тег"
							/>
						</div>
					</div>
				</section>

				<section id="quiz">
					<div id="quiz-list"></div>

					<button type="submit" className="btn btn-primary" name="create">
						Завершить прохождение
					</button>
				</section>
			</form>
		</main>
	);
};
