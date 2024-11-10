let currentUrl = window.location.href;
let tabCreated = document.querySelector(`#tab-created`);
let tabFinished = document.querySelector(`#tab-finished`);

if (currentUrl.includes(`created`)) {
	tabCreated.classList.add(`active`);
	tabFinished.classList.remove(`active`);
} else if (currentUrl.includes(`finished`)) {
	tabFinished.classList.add(`active`);
	tabCreated.classList.remove(`active`);
} else {
	tabCreated.classList.add(`active`);
	tabFinished.classList.remove(`active`);
}
