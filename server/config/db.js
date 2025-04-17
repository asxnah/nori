import mongoose from 'mongoose';
import dotenv from 'dotenv';
import process from 'process';

dotenv.config();

const connectDB = async () => {
	try {
		const mongoURI =
			process.env.MONGODB_URI || 'mongodb://localhost:27017/nori';
		await mongoose.connect(mongoURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.debug('База данных подключена');
	} catch (err) {
		console.error('Ошибка при подключении к базе данных: ' + err);
		process.exit(1);
	}
};

export default connectDB;
