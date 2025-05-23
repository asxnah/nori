import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
	questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
	selected: [mongoose.Schema.Types.Mixed],
});

const userAnswerSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
	answers: [answerSchema],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const UserAnswer = mongoose.model('UserAnswer', userAnswerSchema);

export default UserAnswer;
