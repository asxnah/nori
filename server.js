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
			user: { username: user.username },
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
					user: { username: existingUser.username },
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
			user: { username: user.username },
		});
	} catch (error) {
		console.error('Registration error:', error);
		res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
	}
});

app.get('/', (req, res) => {
	return res.send('сервер запущен');
});

app.listen(port, () => {
	console.log(`сервер запущен: http://localhost:${port}`);
});
