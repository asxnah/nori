import express from 'express';
import mongoose from 'mongoose';
import Quiz from './models/Quiz';

const app = express();
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/nori', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// API для создания викторины
app.post('/quizzes', async (req, res) => {
	try {
		const newQuiz = new Quiz(req.body);
		await newQuiz.save();
		res.status(201).json(newQuiz);
	} catch (err) {
		res.status(500).json({ error: 'Ошибка при создании викторины: ', err });
	}
});

// API для получения всех викторин
app.get('/quizzes', async (req, res) => {
	try {
		const quizzes = await Quiz.find();
		res.json(quizzes);
	} catch (err) {
		res.status(500).json({ error: 'Ошибка при получении викторин: ', err });
	}
});

// Запуск сервера
app.listen(5000, () => console.log('✅ Сервер запущен на порту 5000'));
