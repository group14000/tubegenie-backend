import { Router } from 'express';
import { contentController } from '../controllers/content.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/content/generate - Generate YouTube content
router.post('/generate', contentController.generateContent.bind(contentController));

// GET /api/content/history - Get user's content history
router.get('/history', contentController.getContentHistory.bind(contentController));

// GET /api/content/:id - Get specific content by ID
router.get('/:id', contentController.getContentById.bind(contentController));

// DELETE /api/content/:id - Delete content
router.delete('/:id', contentController.deleteContent.bind(contentController));

export default router;
