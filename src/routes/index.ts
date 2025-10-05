import { Router } from 'express';
import contentRoutes from './content.routes';

const router = Router();

// Mount routes
router.use('/content', contentRoutes);

// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TubeGenie API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
