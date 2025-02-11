import React from 'react';
import './styles/Create.css';

const Create = () => {
	return (
		<div id="CreatePage">
			<main>
				<form action="__create.php" method="post">
					<section id="info" className="card card-outline">
						<div id="heading">
							<h2>О викторине</h2>
							<div className="faded-text" id="remove-bg-btn" tabindex="0">
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
						<div id="quizzes-heading">
							<h2>Вопросы</h2>
							<menu id="menu-pc">
								<div
									role="button"
									id="multiple-choice"
									className="btn btn-secondary"
									tabindex="0"
								>
									<img src="./assets/icons/plus.png" alt="+" />
									Выбор
								</div>
								<div
									role="button"
									id="true-false"
									className="btn btn-secondary"
									tabindex="0"
								>
									<img src="./assets/icons/plus.png" alt="+" />
									Истинно / Ложно
								</div>
								<div
									role="button"
									id="open-text"
									className="btn btn-secondary"
									tabindex="0"
								>
									<img src="./assets/icons/plus.png" alt="+" />
									Открытый вопрос
								</div>
								<div
									role="button"
									className="btn btn-secondary open-popup"
									tabindex="0"
								>
									<img src="./assets/icons/plus.png" alt="+" />
									Таймер
								</div>
							</menu>
							<menu id="menu-mobile">
								<div
									role="button"
									id="dropdown-button"
									className="btn btn-secondary"
									tabindex="0"
								>
									<img
										src="./assets/icons/plus.png"
										aria-label="добавить вопрос"
										alt="+ добавить вопрос"
									/>
								</div>
								<div id="menu-questions" className="dropdown-content">
									<div role="button" id="multiple-choice" tabindex="0">
										<span>Выбор</span>
									</div>
									<hr />
									<div role="button" id="true-false" tabindex="0">
										<span>Истинно / Ложно</span>
									</div>
									<hr />
									<div role="button" id="open-text" tabindex="0">
										<span>Открытый вопрос</span>
									</div>
									<hr />
									<div role="button" className="open-popup" tabindex="0">
										<span>Таймер</span>
									</div>
								</div>
							</menu>
						</div>

						<div id="quiz-list"></div>

						<div className="group">
							<button type="submit" className="btn btn-primary" name="create">
								Создать
							</button>
							<button
								type="submit"
								className="btn btn-secondary"
								name="create_download"
							>
								<span>Скачать</span>
								<span>DOCX</span>
							</button>
						</div>
					</section>
				</form>
			</main>

			<section className="popup-con">
				<div className="popup card card-outline">
					<div className="heading">
						<h2>Таймер</h2>
						<div role="button" className="close-popup" tabindex="0">
							<img
								src="./assets/icons/cross.png"
								alt="закрыть окно"
								title="закрыть окно"
							/>
						</div>
					</div>
					<div className="content">
						<p className="faded-text">
							Заполните хотя бы одно поле для добавления таймера.
						</p>
						<div className="group btn">
							<input type="number" id="hours" name="hours" placeholder="Часы" />
							<label htmlFor="hours">ч</label>
						</div>
						<div className="group btn">
							<input
								type="number"
								id="minutes"
								name="minutes"
								placeholder="Минуты"
							/>
							<label htmlFor="minutes">мин</label>
						</div>
					</div>
					<div className="group">
						<div
							role="button"
							id="save-timer"
							className="btn btn-primary close-popup"
							tabindex="0"
						>
							Сохранить
						</div>
						<div
							role="button"
							className="btn btn-secondary close-popup"
							tabindex="0"
						>
							Отмена
						</div>
					</div>
					<div
						role="button"
						id="delete-timer"
						className="faded-text close-popup"
					>
						Удалить таймер
					</div>
				</div>
			</section>
		</div>
	);
};

export default Create;
