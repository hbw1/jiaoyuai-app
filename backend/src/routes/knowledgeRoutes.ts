import { Router } from 'express';
import { KnowledgeController } from '../controllers/knowledgeController';
import { optionalAuth } from '../middleware/auth';

const router = Router();
const knowledgeController = new KnowledgeController();

router.get('/subjects', knowledgeController.getSubjects);
router.get('/subjects/:subjectId/grades/:grade/points', knowledgeController.getKnowledgePoints);
router.get('/points/:pointId', knowledgeController.getKnowledgePointDetail);
router.get('/tree/:subjectId/:grade', knowledgeController.getKnowledgeTree);

export default router;
