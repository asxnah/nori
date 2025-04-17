import mongoose from 'mongoose';
import process from 'process';

const connectDB = async () => {
	try {
		const mongoURI =
			process.env.MONGODB_URI || 'mongodb://localhost:27017/nori';
		await mongoose.connect(mongoURI);
		console.debug('база данных подключена');
	} catch (err) {
		console.error('ошибка в подключении базы данных: ' + err);
		process.exit(1);
	}
};

export default connectDB;
