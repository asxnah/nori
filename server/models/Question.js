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
	points: {
		type: Number,
		default: 1
	}
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
