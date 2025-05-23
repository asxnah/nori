import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
	title: String,
	description: String,
	background: String,
	tags: [String],
	questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
	timer: {
		type: Object,
		default: null,
	},
	createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const Test = mongoose.model('Test', testSchema);

export default Test;
