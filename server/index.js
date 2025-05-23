import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';
import dotenv from 'dotenv';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

connectDB();

console.log('Mounting route /api');
app.use('/api', authRoutes);

console.log('Mounting route /api/quizzes');
app.use('/api/quizzes', quizRoutes);

app.get('/', (req, res) => {
	res.send('Сервер запущен.');
});

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.resolve(__dirname, '../dist')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
	});
} else {
	console.log('Работает в режиме разработки, не обслуживая фронтенд.');
}

app.listen(port, '0.0.0.0', () => {
	console.log(`Сервер запущен на порту ${port}.`);
});
