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

app.get('/', (req, res) => {
	return res.send('сервер запущен');
});

app.post('/register', async (req, res) => {
	const { username, password } = req.body;

	const existingUser = await User.findOne({ username });
	if (existingUser) {
		return res.send({ message: false });
	}

	const user = new User({ name: username, username, password });
	try {
		await user.save();
		return res.send({ message: true });
		// eslint-disable-next-line no-unused-vars
	} catch (err) {
		return res.send({ message: false });
	}
});

app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username: username });

	if (!user) return res.send({ message: false });
	return res.send({ message: user.password === password });
});

app.post('/user', async (req, res) => {
	const { username } = req.body;
	const user = await User.findOne({ username: username });

	if (user) return res.send(user);
	return res.send({ message: false });
});

app.put('/account-edit', async (req, res) => {
	const { username, new_name, new_username, new_password, current_password } =
		req.body;

	const user = await User.findOne({ username: username });

	if (current_password !== user.password) {
		return res.send({
			message: '⚠️ Неверный пароль',
		});
	}

	if (new_name) {
		const updated = await User.findOneAndUpdate(
			{ username: username },
			{ name: new_name }
		);

		if (updated) return res.send({ message: true });
	}

	if (new_username) {
		const existingUser = await User.findOne({ username: new_username });
		if (existingUser && existingUser.username !== username) {
			return res.send({ message: 'Такое имя пользователя уже существует' });
		}

		const updated = await User.findOneAndUpdate(
			{ username: username },
			{ username: new_username }
		);

		if (updated) return res.send({ message: true });
	}

	if (new_password) {
		const updated = await User.findOneAndUpdate(
			{ username: username },
			{ password: new_password }
		);

		if (updated) return res.send({ message: true });
	}

	res.send({ message: true });
});

app.listen(port, () => {
	console.log(`сервер запущен: http://localhost:${port}`);
});
