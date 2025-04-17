### Порядок работы:

1. **Запусти сервер MongoDB** (если у тебя локальный MongoDB):

   ```sh
   mongod
   ```

2. **Загрузи пакеты**:

```sh
npm i
```

3. **Запусти сервер**:

   ```sh
   npm run server
   ```

4. **Запусти React-приложение**:
   ```sh
   npm run dev
   ```

Ah, good point! For production environments, we should use environment variables instead of hardcoding the MongoDB connection string. Let me help you set this up:

1. First, let's modify the `db.js` file to use environment variables:

```javascript:server/config/db.js
import mongoose from 'mongoose';
import process from 'process';

const connectDB = async () => {
	try {
		const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nori';
		await mongoose.connect(mongoURI);
		console.debug('база данных подключена');
	} catch (err) {
		console.error('ошибка в подключении базы данных: ' + err);
		process.exit(1);
	}
};


## 1. Create a `.env` file in your project root (if you don't have one already)
## 2. Add your MongoDB connection string to it:
```
MONGODB_URI=your_mongodb_connection_string
```

### For local development, it will fall back to `mongodb://localhost:27017/nori` if no environment variable is set.

### For production:
- If you're using a MongoDB hosting service (like MongoDB Atlas), you'll get a connection string that looks like: `mongodb+srv://username:password@cluster.mongodb.net/nori`
- If you're using a different hosting service, they'll provide their own MongoDB connection string
- Just set the `MONGODB_URI` environment variable to that connection string in your hosting environment

This way, your application will work both locally and in production without any code changes.

```
import mongoose from 'mongoose';
import process from 'process';

const connectDB = async () => {
   try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nori';
      await mongoose.connect(mongoURI);
      console.debug('база данных подключена');
   } catch (err) {
      console.error('ошибка в подключении базы данных: ' + err);
      process.exit(1);
   }
};

export default connectDB;
```
