import express from 'express';
import Test from '../models/Test.js';
import Question from '../models/Question.js';
import UserAnswer from '../models/UserAnswer.js';
import multer from 'multer';
import path from 'path';
import process from 'process';
import fs from 'fs';

import { retry } from '../utils/retry.js';
import { isRetriableError } from '../utils/isRetriableError.js';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(process.cwd(), 'uploads'));
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
		const { search } = req.query;
		let query = {};

		if (search) {
			query = {
				$or: [
					{ title: { $regex: search, $options: 'i' } },
					{ tags: { $regex: search, $options: 'i' } },
				],
			};
		}

		const quizzes = await retry(
			() =>
				Test.find(query, {
					title: 1,
					description: 1,
					background: 1,
					tags: 1,
					questionIds: 1,
				})
					.sort({ createdAt: -1 })
					.limit(search ? 0 : 6)
					.populate('questionIds'),
			3,
			500,
			isRetriableError
		);

		res.json(quizzes);
	} catch (error) {
		console.error('CATCH Ошибка загрузки викторин >> ', error);
		res.status(500).json({ message: 'Ошибка загрузки викторин' });
	}
});

router.get('/user/:userId', async (req, res) => {
	try {
		const { userId } = req.params;

		const quizzes = await retry(
			() =>
				Test.find(
					{ createdBy: userId },
					{
						title: 1,
						description: 1,
						background: 1,
						tags: 1,
						questionIds: 1,
					}
				)
					.sort({ createdAt: -1 })
					.populate('questionIds'),
			3,
			500,
			isRetriableError
		);

		res.json(quizzes);
	} catch (error) {
		console.error('CATCH Ошибка загрузки викторин пользователя >> ', error);
		res.status(500).json({ message: 'Ошибка загрузки викторин пользователя' });
	}
});

router.get('/:testId', async (req, res) => {
	try {
		const { testId } = req.params;
		const test = await retry(
			() =>
				Test.findById(testId)
					.populate('questionIds')
					.populate('createdBy', 'username name'),
			3,
			500,
			isRetriableError
		);

		if (!test) {
			return res.status(404).json({ message: 'Викторина не найдена' });
		}

		res.json(test);
	} catch (error) {
		console.error('CATCH Ошибка загрузки викторины >> ', error);
		res.status(500).json({ message: 'Ошибка загрузки викторины' });
	}
});

router.get('/:testId/questions', async (req, res) => {
	try {
		const { testId } = req.params;

		const test = await retry(
			() => Test.findById(testId),
			3,
			500,
			isRetriableError
		);

		if (!test) {
			return res.status(404).json({ message: 'Викторина не найдена' });
		}

		const questions = await retry(
			() => Question.find({ _id: { $in: test.questionIds } }),
			3,
			500,
			isRetriableError
		);

		res.json(questions);
	} catch (error) {
		console.error('CATCH Ошибка загрузки вопросов викторины >> ', error);
		res.status(500).json({
			message: 'Ошибка загрузки вопросов викторины',
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

		await retry(() => userAnswer.save(), 3, 500, isRetriableError);
		res.status(201).json({ message: 'Ответы успешно сохранены', userAnswer });
	} catch (error) {
		console.error('CATCH Ошибка сохранения ответов >> ', error);
		res.status(500).json({ message: 'Ошибка сохранения ответов' });
	}
});

router.get('/:testId/answers/:userId', async (req, res) => {
	try {
		const { testId, userId } = req.params;

		const userAnswer = await retry(
			() =>
				UserAnswer.findOne({
					testId,
					userId,
				}).populate('answers.questionId'),
			3,
			500,
			isRetriableError
		);

		if (!userAnswer) {
			return res.status(404).json({ message: 'Ответы не найдены' });
		}

		res.json(userAnswer);
	} catch (error) {
		console.error('CATCH Ошибка загрузки ответов пользователя >> ', error);
		res.status(500).json({ message: 'Ошибка загрузки ответов пользователя' });
	}
});

router.get('/:testId/answers', async (req, res) => {
	try {
		const { testId } = req.params;

		const userAnswers = await retry(
			() =>
				UserAnswer.find({ testId })
					.populate('userId', 'username name')
					.populate('answers.questionId'),
			3,
			500,
			isRetriableError
		);

		res.json(userAnswers);
	} catch (error) {
		console.error('CATCH Ошибка загрузки ответов пользователей >> ', error);
		res.status(500).json({ message: 'Ошибка загрузки ответов пользователей' });
	}
});

router.get('/answers/:answerId', async (req, res) => {
	try {
		const { answerId } = req.params;

		const userAnswer = await retry(
			() =>
				UserAnswer.findById(answerId)
					.populate('answers.questionId')
					.populate('userId', 'username name'),
			3,
			500,
			isRetriableError
		);

		if (!userAnswer) {
			return res.status(404).json({ message: 'Ответы не найдены' });
		}

		res.json(userAnswer);
	} catch (error) {
		console.error('CATCH Ошибка загрузки ответов пользователя >> ', error);
		res.status(500).json({ message: 'Ошибка загрузки ответов пользователя' });
	}
});

router.get('/answers/user/:userId', async (req, res) => {
	try {
		const { userId } = req.params;

		const userAnswers = await retry(
			() =>
				UserAnswer.find({ userId })
					.sort({ createdAt: -1 })
					.populate('testId', 'title tags background')
					.populate('answers.questionId'),
			3,
			500,
			isRetriableError
		);

		const completedQuizzes = await Promise.all(
			userAnswers.map(async (userAnswer) => {
				const test = await retry(
					() => Test.findById(userAnswer.testId).populate('questionIds'),
					3,
					500,
					isRetriableError
				);
				return {
					...userAnswer.toObject(),
					testId: test,
				};
			})
		);

		res.json(completedQuizzes);
	} catch (error) {
		console.error('CATCH Ошибка загрузки завершенных викторин >> ', error);
		res.status(500).json({ message: 'Ошибка загрузки завершенных викторин' });
	}
});

router.post('/', upload.single('background'), async (req, res) => {
	try {
		const { title, description, createdBy } = req.body;
		const tags = JSON.parse(req.body.tags);
		const questions = JSON.parse(req.body.questions);
		const timer = req.body.timer === 'null' ? null : JSON.parse(req.body.timer);

		if (!title || !questions || !createdBy) {
			return res
				.status(400)
				.json({ message: 'Не все обязательные поля заполнены' });
		}

		if (!Array.isArray(questions) || questions.length === 0) {
			return res.status(400).json({ message: 'Неверный формат вопросов' });
		}

		if (!Array.isArray(tags)) {
			return res.status(400).json({ message: 'Неверный формат тегов' });
		}

		const background = req.file
			? `${process.env.VITE_API_URL}/uploads/${req.file.filename}`
			: null;

		const savedQuestions = await Promise.all(
			questions.map((question) =>
				retry(
					async () => {
						if (!question.text || !question.type) {
							throw new Error('Invalid question format');
						}
						const newQuestion = new Question({
							questionText: question.text,
							type: question.type,
							options: question.answers || [],
							correctAnswers: question.correctAnswers,
							points: question.points || 1,
						});
						return await newQuestion.save();
					},
					3, // количество попыток
					500, // задержка между попытками (мс)
					isRetriableError
				)
			)
		);

		const test = new Test({
			title,
			description: description || '',
			background,
			tags: tags.filter((tag) => tag.trim()),
			questionIds: savedQuestions.map((q) => q._id),
			timer,
			createdBy,
		});

		await retry(() => test.save(), 3, 500, isRetriableError);

		res.status(201).json({
			message: 'Викторина создана',
			testId: test._id,
		});
	} catch (error) {
		console.error('CATCH Ошибка создания викторины >> ', error);
		if (error instanceof SyntaxError) {
			res.status(400).json({ message: 'Неверный формат данных' });
		} else {
			res.status(500).json({
				message: 'Ошибка создания викторины',
				error: error.message,
				stack: error.stack,
			});
		}
	}
});

router.delete('/:testId', async (req, res) => {
	try {
		const { testId } = req.params;

		const test = await retry(
			() => Test.findById(testId),
			3,
			500,
			isRetriableError
		);
		if (!test) {
			return res.status(404).json({ message: 'Викторина не найдена' });
		}

		if (test.background) {
			try {
				const url = new URL(test.background);
				const backgroundFilename = path.basename(url.pathname);

				const fullPath = path.join(
					process.cwd(),
					'uploads',
					backgroundFilename
				);

				if (fs.existsSync(fullPath)) {
					fs.unlinkSync(fullPath);
				}
			} catch (err) {
				console.error('CATCH Ошибка удаления фона >> ', err);
			}
		}

		await retry(
			() =>
				Promise.all([
					Question.deleteMany({ _id: { $in: test.questionIds } }),
					UserAnswer.deleteMany({ testId }),
					Test.findByIdAndDelete(testId),
				]),
			3,
			500,
			isRetriableError
		);

		res.json({ message: 'Викторина удалена' });
	} catch (error) {
		console.error('CATCH Ошибка удаления викторины >> ', error);
		res.status(500).json({ message: 'Ошибка удаления викторины' });
	}
});

router.put('/:testId', upload.single('background'), async (req, res) => {
	try {
		const { testId } = req.params;
		const { title, description, createdBy } = req.body;
		const tags = JSON.parse(req.body.tags);
		const questions = JSON.parse(req.body.questions);
		const timer = req.body.timer === 'null' ? null : JSON.parse(req.body.timer);

		if (!title || !questions || !createdBy) {
			return res
				.status(400)
				.json({ message: 'Не все обязательные поля заполнены' });
		}

		const existingTest = await retry(
			() => Test.findById(testId),
			3,
			500,
			isRetriableError
		);
		if (!existingTest) {
			return res.status(404).json({ message: 'Викторина не найдена' });
		}

		await retry(
			() => Question.deleteMany({ _id: { $in: existingTest.questionIds } }),
			3,
			500,
			isRetriableError
		);

		const savedQuestions = await Promise.all(
			questions.map((question) =>
				retry(
					async () => {
						const newQuestion = new Question({
							questionText: question.text,
							type: question.type,
							options: question.answers || [],
							correctAnswers: question.correctAnswers,
							points: question.points || 1,
						});
						return await newQuestion.save();
					},
					3,
					500,
					isRetriableError
				)
			)
		);

		let background = existingTest.background;
		if (req.file) {
			if (existingTest.background) {
				const oldPath = existingTest.background.split('/uploads/')[1];
				if (oldPath) {
					const fullPath = path.join(process.cwd(), 'uploads', oldPath);
					if (fs.existsSync(fullPath)) {
						fs.unlinkSync(fullPath);
					}
				}
			}
			background = `${process.env.VITE_API_URL}/uploads/${req.file.filename}`;
		}

		const updatedTest = await retry(
			() =>
				Test.findByIdAndUpdate(
					testId,
					{
						title,
						description: description || '',
						background,
						tags: tags.filter((tag) => tag.trim()),
						questionIds: savedQuestions.map((q) => q._id),
						timer,
					},
					{ new: true }
				),
			3,
			500,
			isRetriableError
		);

		res.json({
			message: 'Викторина обновлена',
			testId: updatedTest._id,
		});
	} catch (error) {
		console.error('CATCH Ошибка обновления викторины >> ', error);
		res.status(500).json({ message: 'Ошибка обновления викторины' });
	}
});

export default router;
