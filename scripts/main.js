// скролл вверх станицы любой из подвала
document.querySelector(`footer #up`).addEventListener(`click`, () => {
	document.body.scrollIntoView({
		behavior: `smooth`,
	});
});
