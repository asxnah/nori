import express from 'express';
import Test from '../models/Test.js';
import Question from '../models/Question.js';
import UserAnswer from '../models/UserAnswer.js';

const router = express.Router();

router.get('/', async (req, res) => {
	try {
		const quizzes = await Test.find(
			{},
			{
				title: 1,
				description: 1,
				background: 1,
				tags: 1,
				questionIds: 1,
			}
		).populate('questionIds');

		res.json(quizzes);
	} catch (error) {
		console.error('Error fetching quizzes:', error);
		res.status(500).json({ message: 'Error fetching quizzes' });
	}
});

router.get('/user/:userId', async (req, res) => {
	try {
		const { userId } = req.params;

		const quizzes = await Test.find(
			{ createdBy: userId },
			{
				title: 1,
				description: 1,
				background: 1,
				tags: 1,
				questionIds: 1,
			}
		).populate('questionIds');

		res.json(quizzes);
	} catch (error) {
		console.error('Error fetching user quizzes:', error);
		res.status(500).json({ message: 'Error fetching user quizzes' });
	}
});

router.get('/:testId', async (req, res) => {
	try {
		const { testId } = req.params;
		const test = await Test.findById(testId)
			.populate('questionIds')
			.populate('createdBy', 'username name');

		if (!test) {
			return res.status(404).json({ message: 'Тест не найден' });
		}

		res.json(test);
	} catch (error) {
		console.error('Error fetching quiz:', error);
		res.status(500).json({ message: 'Error fetching quiz' });
	}
});

router.get('/:testId/questions', async (req, res) => {
	try {
		const { testId } = req.params;
		console.log('Fetching questions for test ID:', testId);

		const test = await Test.findById(testId);
		console.log('Found test:', test);

		if (!test) {
			console.log('Test not found');
			return res.status(404).json({ message: 'Тест не найден' });
		}

		const questions = await Question.find({ _id: { $in: test.questionIds } });
		console.log('Found questions:', questions);

		res.json(questions);
	} catch (error) {
		console.error('Error details:', error);
		res.status(500).json({
			message: 'Error fetching quiz questions',
			error: error.message,
		});
	}
});

router.post('/:testId/answers', async (req, res) => {
	try {
		const { testId } = req.params;
		const { userId, answers } = req.body;

		// Create a new UserAnswer document
		const userAnswer = new UserAnswer({
			userId,
			testId,
			answers: answers.map((answer) => ({
				questionId: answer.questionId,
				selected: Array.isArray(answer.selected)
					? answer.selected
					: [answer.selected],
			})),
		});

		await userAnswer.save();
		res.status(201).json({ message: 'Ответы успешно сохранены', userAnswer });
	} catch (error) {
		console.error('Error saving answers:', error);
		res.status(500).json({ message: 'Ошибка при сохранении ответов' });
	}
});

router.get('/:testId/answers/:userId', async (req, res) => {
	try {
		const { testId, userId } = req.params;

		// Find the user's answers for this test
		const userAnswer = await UserAnswer.findOne({
			testId,
			userId,
		}).populate('answers.questionId');

		if (!userAnswer) {
			return res.status(404).json({ message: 'Ответы не найдены' });
		}

		res.json(userAnswer);
	} catch (error) {
		console.error('Error fetching user answers:', error);
		res.status(500).json({ message: 'Ошибка при получении ответов' });
	}
});

router.get('/:testId/answers', async (req, res) => {
	try {
		const { testId } = req.params;

		// Find all user answers for this test
		const userAnswers = await UserAnswer.find({ testId })
			.populate('userId', 'username name')
			.populate('answers.questionId');

		res.json(userAnswers);
	} catch (error) {
		console.error('Error fetching all user answers:', error);
		res
			.status(500)
			.json({ message: 'Ошибка при получении ответов пользователей' });
	}
});

router.get('/answers/:answerId', async (req, res) => {
	try {
		const { answerId } = req.params;

		// Find the specific user answer
		const userAnswer = await UserAnswer.findById(answerId)
			.populate('answers.questionId')
			.populate('userId', 'username name');

		if (!userAnswer) {
			return res.status(404).json({ message: 'Ответы не найдены' });
		}

		res.json(userAnswer);
	} catch (error) {
		console.error('Error fetching user answer:', error);
		res.status(500).json({ message: 'Ошибка при получении ответов' });
	}
});

router.get('/answers/user/:userId', async (req, res) => {
	try {
		const { userId } = req.params;

		// Find all user answers and populate test and question data
		const userAnswers = await UserAnswer.find({ userId })
			.populate('testId', 'title tags background')
			.populate('answers.questionId');

		// For each user answer, fetch the complete test data
		const completedQuizzes = await Promise.all(
			userAnswers.map(async (userAnswer) => {
				const test = await Test.findById(userAnswer.testId).populate(
					'questionIds'
				);
				return {
					...userAnswer.toObject(),
					testId: test,
				};
			})
		);

		res.json(completedQuizzes);
	} catch (error) {
		console.error('Error fetching user completed quizzes:', error);
		res
			.status(500)
			.json({ message: 'Ошибка при получении пройденных викторин' });
	}
});

export default router;
