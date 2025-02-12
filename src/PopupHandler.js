// src/PopupHandler.js
import React, { useEffect } from 'react';

const PopupHandler = () => {
	useEffect(() => {
		const topElement = document.querySelector('#top');
		const body = document.querySelector('body');

		const handleTopClick = () => {
			document.body.scrollIntoView({
				behavior: 'smooth',
			});
		};

		topElement?.addEventListener('click', handleTopClick);

		const openPopupBtns = document.querySelectorAll('.open-popup');
		openPopupBtns.forEach((btn) => {
			btn.addEventListener('click', (evt) => {
				evt.preventDefault();
				const popup = btn.closest('body').querySelector('.popup-con');
				if (popup) {
					popup.classList.add('show');
					// body.classList.add('popupped');
					body.style.overflow = 'hidden';
				}
			});
		});

		const closePopupBtns = document.querySelectorAll('.close-popup');
		closePopupBtns.forEach((btn) => {
			btn.addEventListener('click', (evt) => {
				evt.preventDefault();
				const popup = btn.closest('.popup-con');
				if (popup) {
					popup.classList.remove('show');
					if (!document.querySelector('.popup-con.show')) {
						// body.classList.remove('popupped');
						body.style.overflow = '';
					}
				}
			});
		});

		// Очистка обработчиков событий при размонтировании компонента
		return () => {
			topElement?.removeEventListener('click', handleTopClick);
			openPopupBtns.forEach((btn) => {
				btn.removeEventListener('click', handleTopClick);
			});
			closePopupBtns.forEach((btn) => {
				btn.removeEventListener('click', handleTopClick);
			});
		};
	}, []);

	return null; // Этот компонент ничего не рендерит
};

export default PopupHandler;
