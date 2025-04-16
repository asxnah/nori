export const validateUsername = (username) => {
	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	return usernameRegex.test(username);
};

export const validatePassword = (password) => {
	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	return hasLowercase && hasUppercase && hasSpecialChar && hasNumber;
};
