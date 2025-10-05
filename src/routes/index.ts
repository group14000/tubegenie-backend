import { Router } from 'express';
import contentRoutes from './content.routes';

const router = Router();

// Mount routes
router.use('/content', contentRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the API is running and responsive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: TubeGenie API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T10:30:00.000Z
 */
// Health check endpoint (no auth required)
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TubeGenie API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
