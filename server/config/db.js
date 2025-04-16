import mongoose from 'mongoose';

const connectDB = async () => {
	try {
		await mongoose.connect('mongodb://localhost:27017/nori');
		console.debug('база данных подключена');
	} catch (err) {
		console.error('ошибка в подключении базы данных: ' + err);
		process.exit(1);
	}
};

export default connectDB;
