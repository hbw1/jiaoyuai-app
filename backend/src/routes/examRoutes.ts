import { Router } from 'express';
import { ExamController } from '../controllers/examController';
import { authMiddleware } from '../middleware/auth';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();
const examController = new ExamController();

router.post('/upload', authMiddleware, uploadMiddleware.array('images', 10), examController.uploadExam);
router.get('/', authMiddleware, examController.getExams);
router.get('/:id', authMiddleware, examController.getExamById);
router.delete('/:id', authMiddleware, examController.deleteExam);

export default router;
