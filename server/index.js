import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quizzes.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', authRoutes);
app.use('/api/quizzes', quizRoutes);

// Basic route
app.get('/', (req, res) => {
	res.send('server is running');
});

// Start server
app.listen(port, () => {
	console.log(`сервер запущен: http://localhost:${port}`);
});
