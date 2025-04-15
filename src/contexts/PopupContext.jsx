// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PopupContext = createContext();

export const usePopup = () => {
	const context = useContext(PopupContext);
	if (!context) {
		throw new Error('usePopup must be used within a PopupProvider');
	}
	return context;
};

export const PopupProvider = ({ children }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [popupContent, setPopupContent] = useState(null);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}, [isOpen]);

	const openPopup = (content) => {
		setPopupContent(content);
		setIsOpen(true);
	};

	const closePopup = () => {
		setIsOpen(false);
		setPopupContent(null);
	};

	return (
		<PopupContext.Provider value={{ openPopup, closePopup }}>
			{children}
			{isOpen && (
				<div className="popup-overlay" onClick={closePopup}>
					<div className="popup-content" onClick={(e) => e.stopPropagation()}>
						{popupContent}
					</div>
				</div>
			)}
		</PopupContext.Provider>
	);
};

PopupProvider.propTypes = {
	children: PropTypes.node.isRequired,
};
