import { Router } from 'express';
import userRoutes from './userRoutes';
import examRoutes from './examRoutes';
import analysisRoutes from './analysisRoutes';
import knowledgeRoutes from './knowledgeRoutes';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'AI教育应用 API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      exams: '/api/exams',
      analysis: '/api/analysis',
      knowledge: '/api/knowledge'
    }
  });
});

router.use('/users', userRoutes);
router.use('/exams', examRoutes);
router.use('/analysis', analysisRoutes);
router.use('/knowledge', knowledgeRoutes);

export default router;
