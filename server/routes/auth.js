import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { validateUsername, validatePassword } from '../utils/validators.js';
import { retry } from '../utils/retry.js';
import { isRetriableError } from '../utils/isRetriableError.js';

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await retry(
			() => User.findOne({ username }),
			3,
			500,
			isRetriableError
		);
		if (!user) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		const isMatch = await retry(
			() => bcrypt.compare(password, user.password),
			2,
			200,
			isRetriableError
		);
		if (!isMatch) {
			return res.status(401).json({ message: 'Неверный логин или пароль' });
		}

		res.json({
			message: 'Успешный вход',
			user: {
				username: user.username,
				name: user.name,
				id: user._id,
			},
		});
	} catch (error) {
		console.error('CATCH Ошибка входа >> ', error);
		res.status(500).json({ message: 'Ошибка при входе' });
	}
});

router.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body;

		const existingUser = await retry(
			() => User.findOne({ username }),
			3,
			500,
			isRetriableError
		);
		if (existingUser) {
			return res.status(400).json({ message: 'Пользователь уже существует' });
		}

		if (!validateUsername(username)) {
			return res.status(400).json({
				message:
					'Логин может содержать только строчные и прописные латинские буквы, цифры и нижнее подчеркивание (_)',
			});
		}

		if (!validatePassword(password)) {
			return res.status(400).json({
				message:
					'Пароль должен содержать строчные и прописные латинские буквы, минимум один специальный символ и минимум одну цифру',
			});
		}

		const hashedPassword = await retry(
			() => bcrypt.hash(password, SALT_ROUNDS),
			2,
			300,
			isRetriableError
		);

		const user = new User({
			name: username,
			username,
			password: hashedPassword,
		});

		await retry(() => user.save(), 3, 500, isRetriableError);

		res.json({
			message: 'Пользователь успешно зарегистрирован',
			user: {
				username: user.username,
				name: user.name,
				id: user._id,
			},
		});
	} catch (error) {
		console.error('CATCH Ошибка регистрации >> ', error);
		res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
	}
});

router.post('/update-profile', async (req, res) => {
	try {
		const {
			current_username,
			new_username,
			new_name,
			new_password,
			current_password,
		} = req.body;

		const user = await retry(
			() => User.findOne({ username: current_username }),
			3,
			500,
			isRetriableError
		);
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		const isMatch = await retry(
			() => bcrypt.compare(current_password, user.password),
			2,
			200,
			isRetriableError
		);
		if (!isMatch) {
			return res.status(401).json({ message: 'Неверный текущий пароль' });
		}

		if (new_username && new_username !== current_username) {
			if (!validateUsername(new_username)) {
				return res.status(400).json({
					message:
						'Логин может содержать только строчные и прописные латинские буквы, цифры и нижнее подчеркивание (_)',
				});
			}

			const existingUser = await retry(
				() => User.findOne({ username: new_username }),
				3,
				500,
				isRetriableError
			);
			if (existingUser) {
				return res.status(400).json({ message: 'Этот логин уже занят' });
			}
		}

		if (new_password && !validatePassword(new_password)) {
			return res.status(400).json({
				message:
					'Пароль должен содержать строчные и прописные латинские буквы, минимум один специальный символ и минимум одну цифру',
			});
		}

		const updateData = {};
		if (new_username) updateData.username = new_username;
		if (new_name) updateData.name = new_name;
		if (new_password) {
			const hashedNewPassword = await retry(
				() => bcrypt.hash(new_password, SALT_ROUNDS),
				2,
				300,
				isRetriableError
			);
			updateData.password = hashedNewPassword;
		}

		await retry(
			() => User.updateOne({ username: current_username }, updateData),
			3,
			500,
			isRetriableError
		);

		res.json({
			message: 'Профиль успешно обновлен',
			user: {
				name: new_name || user.name,
				username: new_username || user.username,
			},
		});
	} catch (error) {
		console.error('CATCH Ошибка обновления профиля >> ', error);
		res.status(500).json({ message: 'Ошибка при обновлении профиля' });
	}
});

export default router;
