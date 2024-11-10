document.addEventListener('DOMContentLoaded', function () {
	// const quizList = document.getElementById('quiz-list');
	// const tabs = document.getElementById('tabs');
	// let userId = null;
	// let quizType = 'created';

	// // Получение user_id через fetch
	// fetch('_fetch_quizes.php')
	// 	.then((response) => {
	// 		if (!response.ok) throw new Error('Network response was not ok');
	// 		return response.json();
	// 	})
	// 	.then((data) => {
	// 		if (data.user_id) {
	// 			userId = data.user_id;
	// 			fetchquizes('created');
	// 		} else {
	// 			console.error('Error:', data.error || 'User not authenticated');
	// 		}
	// 	})
	// .catch((error) => console.error('Error fetching user ID:', error));

	// Смена вкладок
	tabs.addEventListener('click', (evt) => {
		if (evt.target.tagName === 'li') {
			document.querySelector('.active').classList.remove('active');
			evt.target.classList.add('active');

			quizType = evt.target.id === 'tab-created' ? 'created' : 'finished';
			// fetchquizes(quizType); // Передаём quizType
		}
	});

	// function fetchquizes(type) {
	// 	if (!userId) return; // Проверка userId
	// 	fetch('_fetch_quizes.php', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify({ user_id: userId, type: type }),
	// 	})
	// 		.then((response) => response.json())
	// 		.then((data) => displayquizes(data.quizes || []))
	// 		.catch((error) => console.error('Error fetching quizes:', error));
	// }

	// function displayquizes(quizes) {
	// 	quizList.innerHTML = '';
	// 	quizes.forEach((quiz) => {
	// 		const quizItem = document.createElement('div');
	// 		quizItem.classList.add('quiz-item');
	// 		quizItem.innerHTML = `
	//     <h3>${quiz.title}</h3>
	//     <p>${quiz.description}</p>
	//     <p>Теги: ${[quiz.tag_1, quiz.tag_2, quiz.tag_3]
	// 			.filter(Boolean)
	// 			.join(', ')}</p>
	//     `;
	// 		quizList.appendChild(quizItem);
	// 	});
	// }
});
