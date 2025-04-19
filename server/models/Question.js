import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	questionText: String,
	type: {
		type: String,
		enum: ['multipleChoice', 'trueFalse', 'openText'],
		required: true,
	},
	options: [String],
	correctAnswers: mongoose.Schema.Types.Mixed,
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
