import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { validateUsername, validatePassword } from '../utils/validators.js';

const router = express.Router();
const SALT_ROUNDS = 10;

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ message: 'Пользователь не существует' });
		}

		// 'await' has no effect on the type of this expression.
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Неверный пароль' });
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

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			// 'await' has no effect on the type of this expression.
			const isMatch = await bcrypt.compare(password, existingUser.password);
			if (isMatch) {
				return res.json({
					message: 'Успешный вход',
					user: {
						username: existingUser.username,
						name: existingUser.name,
						id: existingUser._id,
					},
				});
			}
			return res.status(401).json({ message: 'Неверный пароль' });
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

		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		const user = new User({
			name: username,
			username,
			password: hashedPassword,
		});

		await user.save();
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

		const user = await User.findOne({ username: current_username });
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		// 'await' has no effect on the type of this expression.
		const isMatch = await bcrypt.compare(current_password, user.password);
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

			const existingUser = await User.findOne({ username: new_username });
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
			// good await
			const hashedNewPassword = await bcrypt.hash(new_password, SALT_ROUNDS);
			updateData.password = hashedNewPassword;
		}

		await User.updateOne({ username: current_username }, updateData);

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
