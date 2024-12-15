if (localStorage.getItem(`banner_hidden`) === `yes`) {
	document.querySelector(`#banner`).remove();
} else {
	document.querySelector(`#take-quiz`).addEventListener(`click`, () => {
		window.scrollTo({
			top: document.querySelector(`#banner`).offsetHeight,
			behavior: `smooth`,
		});
	});

	document.querySelector(`#remove-banner`).addEventListener(`click`, () => {
		window.scrollTo({
			top: document.querySelector(`#banner`).offsetHeight,
			behavior: `smooth`,
		});

		setTimeout(() => {
			document.querySelector(`#banner`).remove();
		}, 500);

		localStorage.setItem(`banner_hidden`, `yes`);
	});
}

// поиск
// document.addEventListener(`DOMContentLoaded`, () => {
// 	let queryInput = document.getElementById(`query`);
// 	let searchButton = document.getElementById(`search`);
// 	let quizesContainer = document.getElementById(`quizes`);
// 	let searchInterval;

// 	function performSearch() {
// 		let query = queryInput.value.trim();
// 		if (query === ``) return;

// 		fetch(`_search_quizes.php?query=${encodeURIComponent(query)}`)
// 			.then((response) => response.json())
// 			.then((data) => {
// 				quizesContainer.innerHTML = ``;
// 				data.forEach((quiz) => {
// 					let quizCard = document.createElement(`a`);
// 					quizCard.href = `quiz.php?quiz_id=${quiz.quiz_id}&title=${quiz.title}`;
// 					quizCard.classList.add(`card-quiz`);
// 					quizCard.setAttribute(`aria-label`, `открыть викторину`);

// 					// Если есть обложка, добавляем стили
// 					if (quiz.cover) {
// 						quizCard.style.background = `
//                             linear-gradient(to left, rgba(50, 50, 50, 0.6) 0%, rgba(50, 50, 50, 0.6) 100%),
//                             url(`./assets/${quiz.cover}`)
//                         `;
// 						quizCard.style.backgroundSize = `cover`;
// 						quizCard.style.backgroundPosition = `center`;
// 					}

// 					quizCard.innerHTML = `
//                         <header>
//                             <p class="question-count" aria-label="количество вопросов викторины">
//                                 ${quiz.question_count}
//                             </p>
//                             <img src="./assets/arrow.png" alt="стрелка, обозначающая открытие ссылки" aria-label="открыть викторину">
//                         </header>
//                         <h3>${quiz.title}</h3>
//                         <footer aria-label="теги викторины">
//                             <p>${quiz.tag_1 || ``}</p>
//                             <p>${quiz.tag_2 || ``}</p>
//                             <p>${quiz.tag_3 || ``}</p>
//                         </footer>
//                     `;
// 					quizesContainer.appendChild(quizCard);
// 				});
// 			})
// 			.catch((error) =>
// 				console.error(`Ошибка при выполнении поиска: ${error}`)
// 			);
// 	}

// 	queryInput.addEventListener(`focus`, () => {
// 		searchInterval = setInterval(() => {
// 			if (queryInput.value.trim() !== ``) {
// 				performSearch();
// 			}
// 		}, 5000);
// 	});

// 	queryInput.addEventListener(`blur`, () => {
// 		clearInterval(searchInterval);
// 	});

// 	queryInput.addEventListener(`keypress`, (e) => {
// 		if (e.key === `Enter` && queryInput.value.trim() !== ``) {
// 			performSearch();
// 		}
// 	});

// 	searchButton.addEventListener(`click`, () => {
// 		if (queryInput.value.trim() !== ``) {
// 			performSearch();
// 		}
// 	});
// });
