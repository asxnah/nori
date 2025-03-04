import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

mongoose
	.connect('mongodb://localhost:27017/nori')
	.then(() => console.debug('connected'))
	.catch((err) => console.error('not connected: ' + err));

app.listen(port, () =>
	console.log(`✅ Сервер запущен: http://localhost:${port}`)
);
