import { Router } from 'express';
import { AnalysisController } from '../controllers/analysisController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const analysisController = new AnalysisController();

router.post('/analyze/:examId', authMiddleware, analysisController.analyzeExam);
router.get('/result/:examId', authMiddleware, analysisController.getAnalysisResult);
router.get('/report/:examId', authMiddleware, analysisController.generateReport);

export default router;
