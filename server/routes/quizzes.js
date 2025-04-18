import express from 'express';
import Test from '../models/Test.js';
import Question from '../models/Question.js';
import UserAnswer from '../models/UserAnswer.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(process.cwd(), 'uploads/quizzesBackground'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	fileFilter: function (req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
			return cb(new Error('Only image files are allowed!'), false);
		}
		cb(null, true);
	},
});

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
				createdAt: 1,
			}
		)
			.sort({ createdAt: -1 })
			.limit(10)
			.populate('questionIds');

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

		const test = await Test.findById(testId);

		if (!test) {
			return res.status(404).json({ message: 'Тест не найден' });
		}

		const questions = await Question.find({ _id: { $in: test.questionIds } });

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

		const userAnswers = await UserAnswer.find({ userId })
			.populate('testId', 'title tags background')
			.populate('answers.questionId');

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

router.post('/', upload.single('background'), async (req, res) => {
	try {
		const { title, description, createdBy } = req.body;
		const tags = JSON.parse(req.body.tags);
		const questions = JSON.parse(req.body.questions);

		if (!title || !questions || !createdBy) {
			return res.status(400).json({ message: 'Missing required fields' });
		}

		if (!Array.isArray(questions) || questions.length === 0) {
			return res.status(400).json({ message: 'Invalid questions format' });
		}

		if (!Array.isArray(tags)) {
			return res.status(400).json({ message: 'Invalid tags format' });
		}

		const background = req.file
			? `${import.meta.env.VITE_API_URL}/uploads/quizzesBackground/${
					req.file.filename
			  }`
			: null;

		const savedQuestions = await Promise.all(
			questions.map(async (question) => {
				if (!question.text || !question.type) {
					throw new Error('Invalid question format');
				}

				const newQuestion = new Question({
					questionText: question.text,
					type: question.type,
					options: question.answers || [],
					correctAnswer: question.correctAnswer,
				});
				return await newQuestion.save();
			})
		);

		const test = new Test({
			title,
			description: description || '',
			background,
			tags: tags.filter((tag) => tag.trim()),
			questionIds: savedQuestions.map((q) => q._id),
			createdBy,
		});

		await test.save();

		res.status(201).json({
			message: 'Quiz created successfully',
			testId: test._id,
		});
	} catch (error) {
		console.error('Error creating quiz:', error);
		if (error instanceof SyntaxError) {
			res.status(400).json({ message: 'Invalid data format' });
		} else {
			res.status(500).json({ message: 'Error creating quiz' });
		}
	}
});

router.delete('/:testId', async (req, res) => {
	try {
		const { testId } = req.params;

		// Delete the test and all associated questions
		const test = await Test.findById(testId);
		if (!test) {
			return res.status(404).json({ message: 'Тест не найден' });
		}

		// Delete background image if it exists
		if (test.background) {
			const backgroundPath = test.background.split(
				'/uploads/quizzesBackground/'
			)[1];
			if (backgroundPath) {
				const fullPath = path.join(
					process.cwd(),
					'uploads',
					'quizzesBackground',
					backgroundPath
				);
				if (fs.existsSync(fullPath)) {
					fs.unlinkSync(fullPath);
				}
			}
		}

		// Delete all questions associated with this test
		await Question.deleteMany({ _id: { $in: test.questionIds } });

		// Delete all user answers for this test
		await UserAnswer.deleteMany({ testId });

		// Finally delete the test itself
		await Test.findByIdAndDelete(testId);

		res.json({ message: 'Тест успешно удален' });
	} catch (error) {
		console.error('Error deleting quiz:', error);
		res.status(500).json({ message: 'Ошибка при удалении теста' });
	}
});

export default router;
