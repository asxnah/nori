import React, { useRef, useState } from 'react';
import './styles/Create.css';

const Create = () => {
	const coverRef = useRef(null);
	const uploadContainerRef = useRef(null);
	const removeBgBtnRef = useRef(null);

	const [backgroundImage, setBackgroundImage] = useState(null);

	const handleKeyDown = (evt) => {
		if (evt.key === 'Enter' || evt.key === ' ') {
			evt.preventDefault();
			evt.target.click();
		}
	};

	const handleFileChange = (evt) => {
		let file = evt.target.files[0];
		if (file) {
			let reader = new FileReader();
			reader.onload = function (e) {
				setBackgroundImage(e.target.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleRemoveBackground = () => {
		setBackgroundImage(null);
		coverRef.current.value = '';
	};

	return (
		<div id="CreatePage">
			<main>
				<form action="__create.php" method="post">
					<section id="info" className="card card-outline">
						<div id="heading">
							<h2>О викторине</h2>
							<div
								className="faded-text"
								id="remove-bg-btn"
								tabIndex="0"
								ref={removeBgBtnRef}
								onClick={handleRemoveBackground}
							>
								Удалить фон
							</div>
						</div>
						<div
							id="upload"
							ref={uploadContainerRef}
							style={{
								backgroundImage: backgroundImage
									? `url(${backgroundImage})`
									: '',
							}}
						>
							<div id="upload-overlay">
								<img
									src="./assets/icons/upload.png"
									id="upload-icon"
									alt="иконка загрузки"
								/>
								<p>Загрузить фон</p>
							</div>
							<input
								type="file"
								name="cover"
								id="cover"
								accept="image/*"
								ref={coverRef}
								onChange={handleFileChange}
							/>
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
								{['multiple-choice', 'true-false', 'open-text', 'timer'].map(
									(id) => (
										<div
											role="button"
											id={id}
											className="btn btn-secondary"
											tabIndex="0"
											key={id}
											onKeyDown={handleKeyDown}
										>
											<img src="./assets/icons/plus.png" alt="+" />
											{id === 'multiple-choice'
												? 'Выбор'
												: id === 'true-false'
												? 'Истинно / Ложно'
												: id === 'open-text'
												? 'Открытый вопрос'
												: 'Таймер'}
										</div>
									)
								)}
							</menu>
							<menu id="menu-mobile">
								<div
									role="button"
									id="dropdown-button"
									className="btn btn-secondary"
									tabIndex="0"
									onKeyDown={handleKeyDown}
								>
									<img
										src="./assets/icons/plus.png"
										aria-label="добавить вопрос"
										alt="+ добавить вопрос"
									/>
								</div>
								<div id="menu-questions" className="dropdown-content">
									{['multiple-choice', 'true-false', 'open-text', 'timer'].map(
										(id) => (
											<div
												role="button"
												id={id}
												tabIndex="0"
												key={id}
												onKeyDown={handleKeyDown}
											>
												<span>
													{id === 'multiple-choice'
														? 'Выбор'
														: id === 'true-false'
														? 'Истинно / Ложно'
														: id === 'open-text'
														? 'Открытый вопрос'
														: 'Таймер'}
												</span>
											</div>
										)
									)}
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
						<div role="button" className="close-popup" tabIndex="0">
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
							tabIndex="0"
						>
							Сохранить
						</div>
						<div
							role="button"
							className="btn btn-secondary close-popup"
							tabIndex="0"
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
