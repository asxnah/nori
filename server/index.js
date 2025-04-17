import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.use('/api', authRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/', (req, res) => {
	res.send('server is running');
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
