document.querySelector(`#top`)?.addEventListener(`click`, () => {
	document.body.scrollIntoView({
		behavior: `smooth`,
	});
});

let openPopupBtns = document.querySelectorAll('.open-popup');
let popups = document.querySelectorAll('.popup-con');
let body = document.querySelector('body');

openPopupBtns.forEach((btn) => {
	btn.addEventListener('click', (evt) => {
		evt.preventDefault();
		let popup = btn.closest('body').querySelector('.popup-con');
		if (popup) {
			popup.classList.add('show');
			body.classList.add('popupped');
			body.style.overflow = 'hidden';
		}
	});
});

let closePopupBtns = document.querySelectorAll('.close-popup');
closePopupBtns.forEach((btn) => {
	btn.addEventListener('click', (evt) => {
		evt.preventDefault();
		let popup = btn.closest('.popup-con');
		if (popup) {
			popup.classList.remove('show');
			if (!document.querySelector('.popup-con.show')) {
				body.classList.remove('popupped');
				body.style.overflow = '';
			}
		}
	});
});
