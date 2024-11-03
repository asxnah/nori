// реализовать поиск по викторинам

localStorage.setItem(`banner_hidden`, `no`); // убрать

if (localStorage.getItem(`banner_hidden`) === `yes`) {
	// скрыть баннер если уже нажималась кнопка `понятно, спасибо!`
	document.querySelector(`#intro`).remove();
} else {
	// скролл к контейнеру викторин на кнопку `пройти`
	document.querySelector(`#take-quiz`).addEventListener(`click`, () => {
		window.scrollTo({
			top: document.querySelector(`#intro`).offsetHeight,
			behavior: `smooth`,
		});
	});

	// спрятать баннер-интро на кнопку `понятно, спасибо!`
	document.querySelector(`#hide-banner`).addEventListener(`click`, () => {
		window.scrollTo({
			top: document.querySelector(`#intro`).offsetHeight,
			behavior: `smooth`,
		});
		setTimeout(() => {
			document.querySelector(`#intro`).remove();
		}, 1000);
		localStorage.setItem(`banner_hidden`, `yes`);
	});
}

// выделение поля ввода при нажатии
document.querySelector(`#query`).addEventListener(`focus`, () => {
	document.querySelector(`#searchbar`).style.borderColor = `var(--color-main)`;
});

// снятие выделения соответственно
document.querySelector(`#query`).addEventListener(`blur`, () => {
	document.querySelector(`#searchbar`).style.borderColor = `var(--gray)`;
});
