import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	questions: [
		{
			questionText: { type: String, required: true },
			type: {
				type: String,
				enum: ['multiple_choice', 'open_text', 'true_false'],
				required: true,
			}, // Тип вопроса
			options: [{ type: String }], // если multiple_choice
			correctAnswer: {
				type: mongoose.Schema.Types.Mixed,
				required: true,
			}, // ID ответа (String), текст (String) или true/false (Boolean)
		},
	],
	createdAt: { type: Date, default: Date.now }, // Дата создания викторины
});

const Quiz = mongoose.model('Quiz', quizSchema);

export default Quiz;
