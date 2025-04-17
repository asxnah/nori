import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

connectDB();

app.use('/api', authRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/', (req, res) => {
	res.send('server is running');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
