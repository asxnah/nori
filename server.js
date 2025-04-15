/* eslint-disable no-undef */
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose
	.connect('mongodb://localhost:27017/nori')
	.then(() => console.debug('база данных подключена'))
	.catch((err) => console.error('ошибка в подключении базы данных: ' + err));

const userSchema = new mongoose.Schema({
	name: String,
	username: String,
	password: String,
});
const User = mongoose.model('User', userSchema);

const validateUsername = (username) => {
	const usernameRegex = /^[a-zA-Z0-9_]+$/;
	return usernameRegex.test(username);
};

const validatePassword = (password) => {
	const hasLowercase = /[a-z]/.test(password);
	const hasUppercase = /[A-Z]/.test(password);
	const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
	const hasNumber = /[0-9]/.test(password);
	return hasLowercase && hasUppercase && hasSpecialChar && hasNumber;
};

app.post('/api/login', async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ message: 'Пользователь не существует' });
		}

		if (user.password !== password) {
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
		console.error('Login error:', error);
		res.status(500).json({ message: 'Ошибка при входе' });
	}
});

app.post('/api/register', async (req, res) => {
	try {
		const { username, password } = req.body;

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			if (existingUser.password === password) {
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

		const user = new User({
			name: username,
			username,
			password,
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
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
	}
});

app.post('/api/update-profile', async (req, res) => {
	try {
		const {
			current_username,
			new_username,
			new_name,
			new_password,
			current_password,
		} = req.body;

		// Find user by current username
		const user = await User.findOne({ username: current_username });
		if (!user) {
			return res.status(404).json({ message: 'Пользователь не найден' });
		}

		// Verify current password
		if (user.password !== current_password) {
			return res.status(401).json({ message: 'Неверный текущий пароль' });
		}

		// Validate new username if provided
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

		// Validate new password if provided
		if (new_password && !validatePassword(new_password)) {
			return res.status(400).json({
				message:
					'Пароль должен содержать строчные и прописные латинские буквы, минимум один специальный символ и минимум одну цифру',
			});
		}

		// Update user data
		const updateData = {};
		if (new_username) updateData.username = new_username;
		if (new_name) updateData.name = new_name;
		if (new_password) updateData.password = new_password;

		await User.updateOne({ username: current_username }, updateData);

		res.json({
			message: 'Профиль успешно обновлен',
			user: {
				name: new_name || user.name,
				username: new_username || user.username,
			},
		});
	} catch (error) {
		console.error('Update profile error:', error);
		res.status(500).json({ message: 'Ошибка при обновлении профиля' });
	}
});

const testSchema = new mongoose.Schema({
	title: String,
	description: String,
	background: String,
	tags: [String],
	questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
});

export const Test = mongoose.model('Test', testSchema);

const optionSchema = new mongoose.Schema({
	optionId: String,
	text: String,
});

const questionSchema = new mongoose.Schema({
	text: String,
	type: { type: String, enum: ['single', 'multiple', 'text'] },
	options: [optionSchema],
	correctAnswers: [String],
});

export const Question = mongoose.model('Question', questionSchema);

const answerSchema = new mongoose.Schema({
	questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
	selected: [String],
});

const userAnswerSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
	answers: [answerSchema],
	submittedAt: { type: Date, default: Date.now },
	score: Number,
});

export const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

// Add endpoint to fetch all quizzes
app.get('/api/quizzes', async (req, res) => {
	try {
		const quizzes = await Test.find(
			{},
			{
				title: 1,
				description: 1,
				background: 1,
				tags: 1,
				questionIds: 1,
				createdAt: 1,
			}
		).populate('questionIds');

		res.json(quizzes);
	} catch (error) {
		console.error('Error fetching quizzes:', error);
		res.status(500).json({ message: 'Error fetching quizzes' });
	}
});

// Add endpoint to fetch quizzes by user ID
app.get('/api/quizzes/user/:userId', async (req, res) => {
	try {
		const { userId } = req.params;

		const quizzes = await Test.find(
			{ createdBy: userId },
			{
				title: 1,
				description: 1,
				background: 1,
				tags: 1,
				questionIds: 1,
				createdAt: 1,
			}
		).populate('questionIds');

		res.json(quizzes);
	} catch (error) {
		console.error('Error fetching user quizzes:', error);
		res.status(500).json({ message: 'Error fetching user quizzes' });
	}
});

app.listen(port, () => {
	console.log(`сервер запущен: http://localhost:${port}`);
});
