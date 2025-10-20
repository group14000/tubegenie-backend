import { Router } from 'express';
import { contentController } from '../controllers/content.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  aiGenerationLimiter,
  readLimiter,
  deleteLimiter,
} from '../middleware/rate-limit.middleware';

const router = Router();

/**
 * @swagger
 * /api/content/generate/test:
 *   post:
 *     summary: Test content generation without authentication (Development only)
 *     description: Generate YouTube content without authentication for testing purposes. Only available in development mode.
 *     tags: [Content Generation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentGeneration'
 *     responses:
 *       200:
 *         description: Content generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
// Test route without authentication (for development/testing only)
if (process.env.NODE_ENV === 'development') {
  router.post('/generate/test', async (req, res, next) => {
    // Mock request with test userId - Clerk auth is now a function
    (req as any).auth = () => ({ userId: 'test-user-123' });
    return contentController.generateContent(req, res, next);
  });
}

// All routes below require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/content/analytics:
 *   get:
 *     summary: Get usage analytics dashboard
 *     description: Retrieve comprehensive analytics including generation history, top topics, usage stats, and model distribution
 *     tags: [Analytics]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Analytics'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 */
router.get(
  '/analytics',
  readLimiter,
  contentController.getAnalytics.bind(contentController)
);

/**
 * @swagger
 * /api/content/models:
 *   get:
 *     summary: Get available AI models
 *     description: Retrieve list of all available AI models with their capabilities and metadata
 *     tags: [Models]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Models retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AIModel'
 *                 defaultModel:
 *                   type: string
 *                   example: tngtech/deepseek-r1t2-chimera:free
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/models',
  readLimiter,
  contentController.getAvailableModels.bind(contentController)
);

/**
 * @swagger
 * /api/content/generate:
 *   post:
 *     summary: Generate YouTube content
 *     description: Generate video titles, descriptions, tags, thumbnail ideas, and script outlines using AI based on a given topic
 *     tags: [Content Generation]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContentGeneration'
 *     responses:
 *       200:
 *         description: Content generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       429:
 *         $ref: '#/components/responses/RateLimitError'
 */
router.post(
  '/generate',
  aiGenerationLimiter,
  contentController.generateContent.bind(contentController)
);

/**
 * @swagger
 * /api/content/search:
 *   get:
 *     summary: Search content
 *     description: Search user's content by keyword across topic, titles, description, and tags
 *     tags: [Content Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           example: tutorial
 *         description: Search keyword
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/search',
  readLimiter,
  contentController.searchContent.bind(contentController)
);

/**
 * @swagger
 * /api/content/favorites:
 *   get:
 *     summary: Get favorite content
 *     description: Retrieve all content marked as favorite by the user
 *     tags: [Content Management]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/favorites',
  readLimiter,
  contentController.getFavorites.bind(contentController)
);

/**
 * @swagger
 * /api/content/history:
 *   get:
 *     summary: Get content history
 *     description: Retrieve user's content generation history with optional limit
 *     tags: [Content Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           example: 20
 *         description: Maximum number of items to return
 *     responses:
 *       200:
 *         description: History retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Content'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/history',
  readLimiter,
  contentController.getContentHistory.bind(contentController)
);

/**
 * @swagger
 * /api/content/export/csv:
 *   get:
 *     summary: Export all content as CSV
 *     description: Download all user's content as a CSV file
 *     tags: [Export]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/export/csv',
  readLimiter,
  contentController.exportAllCSV.bind(contentController)
);

/**
 * @swagger
 * /api/content/{id}/favorite:
 *   patch:
 *     summary: Toggle favorite status
 *     description: Mark or unmark content as favorite
 *     tags: [Content Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Favorite status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *                 message:
 *                   type: string
 *                   example: Added to favorites
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch(
  '/:id/favorite',
  readLimiter,
  contentController.toggleFavorite.bind(contentController)
);

/**
 * @swagger
 * /api/content/{id}/export/pdf:
 *   get:
 *     summary: Export content as PDF
 *     description: Download specific content as a PDF file
 *     tags: [Export]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Content ID
 *     responses:
 *       200:
 *         description: PDF file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/:id/export/pdf',
  readLimiter,
  contentController.exportPDF.bind(contentController)
);

/**
 * @swagger
 * /api/content/{id}/export/csv:
 *   get:
 *     summary: Export content as CSV
 *     description: Download specific content as a CSV file
 *     tags: [Export]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Content ID
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/:id/export/csv',
  readLimiter,
  contentController.exportCSV.bind(contentController)
);

/**
 * @swagger
 * /api/content/{id}/export/text:
 *   get:
 *     summary: Export content as plain text
 *     description: Get content in plain text format for clipboard
 *     tags: [Export]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Plain text content
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Topic: My Video Topic\n\nTitles:\n1. Amazing Title\n\nDescription:\nA great video description..."
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/:id/export/text',
  readLimiter,
  contentController.exportText.bind(contentController)
);

/**
 * @swagger
 * /api/content/{id}/export/markdown:
 *   get:
 *     summary: Export content as Markdown
 *     description: Get content formatted in Markdown syntax
 *     tags: [Export]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Markdown formatted content
 *         content:
 *           text/markdown:
 *             schema:
 *               type: string
 *               example: "# My Video Topic\n\n## Titles\n\n1. **Amazing Title**\n\n## Description\n\nA great video description..."
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/:id/export/markdown',
  readLimiter,
  contentController.exportMarkdown.bind(contentController)
);

/**
 * @swagger
 * /api/content/{id}:
 *   get:
 *     summary: Get content by ID
 *     description: Retrieve specific content item by its ID
 *     tags: [Content Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Content'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *   delete:
 *     summary: Delete content
 *     description: Delete specific content item by its ID
 *     tags: [Content Management]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         description: Content ID
 *     responses:
 *       200:
 *         description: Content deleted successfully
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
 *                   example: Content deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  '/:id',
  readLimiter,
  contentController.getContentById.bind(contentController)
);
router.delete(
  '/:id',
  deleteLimiter,
  contentController.deleteContent.bind(contentController)
);

export default router;
