import { Request, Response, NextFunction } from 'express';
import { contentService } from '../services/content.service';
import { exportService } from '../services/export.service';
import { analyticsService } from '../services/analytics.service';
import { isValidModel, AVAILABLE_MODELS, DEFAULT_MODEL } from '../config/ai.config';

// Helper function to extract userId from Clerk auth
function getUserId(req: Request): string | null {
  const auth = (req as any).auth?.(); // Clerk auth is now a function
  return auth?.userId || auth?.sessionClaims?.sub || auth?.subject || null;
}

export class ContentController {
  /**
   * Generate YouTube content based on topic
   * POST /api/content/generate
   */
  async generateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topic, model } = req.body;

      // Validate topic
      if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Topic is required and must be a non-empty string',
        });
        return;
      }

      // Validate model if provided
      if (model && !isValidModel(model)) {
        res.status(400).json({
          success: false,
          error: `Invalid AI model. Available models: ${AVAILABLE_MODELS.map(m => m.id).join(', ')}`,
        });
        return;
      }

      // Get userId from Clerk auth (attached by requireAuth middleware)
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      // Generate and save content with selected model
      const selectedModel = model || DEFAULT_MODEL;
      const content = await contentService.generateAndSaveContent(userId, topic.trim(), selectedModel);

      res.status(201).json({
        success: true,
        data: {
          titles: content.titles,
          description: content.description,
          tags: content.tags,
          thumbnailIdeas: content.thumbnailIdeas,
          scriptOutline: content.scriptOutline,
          aiModel: content.aiModel,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get available AI models
   * GET /api/content/models
   */
  async getAvailableModels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: AVAILABLE_MODELS,
        defaultModel: DEFAULT_MODEL,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user's content history
   * GET /api/content/history
   */
  async getContentHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const limit = parseInt(req.query.limit as string) || 10;
      const content = await contentService.getUserContent(userId, limit);

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get content by ID
   * GET /api/content/:id
   */
  async getContentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const content = await contentService.getContentById(id, userId);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete content
   * DELETE /api/content/:id
   */
  async deleteContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const deleted = await contentService.deleteContent(id, userId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Content not found or already deleted',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Content deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Toggle favorite status
   * PATCH /api/content/:id/favorite
   */
  async toggleFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const content = await contentService.toggleFavorite(id, userId);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: content,
        message: content.isFavorite ? 'Added to favorites' : 'Removed from favorites',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get favorite content
   * GET /api/content/favorites
   */
  async getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const favorites = await contentService.getFavorites(userId);

      res.status(200).json({
        success: true,
        data: favorites,
        count: favorites.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search content
   * GET /api/content/search?q=keyword
   */
  async searchContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const keyword = req.query.q as string;

      if (!keyword || keyword.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Search keyword is required (use ?q=keyword)',
        });
        return;
      }

      const results = await contentService.searchContent(userId, keyword.trim());

      res.status(200).json({
        success: true,
        data: results,
        count: results.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export content as PDF
   * GET /api/content/:id/export/pdf
   */
  async exportPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const content = await contentService.getContentById(id, userId);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      // Generate PDF
      const pdfDoc = exportService.generatePDF(content);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="tubegenie-${content.topic.replace(/\s+/g, '-').toLowerCase()}.pdf"`);

      // Pipe PDF to response
      pdfDoc.pipe(res);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export content as CSV
   * GET /api/content/:id/export/csv
   */
  async exportCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const content = await contentService.getContentById(id, userId);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      // Generate CSV
      const csv = exportService.generateCSV(content);

      // Set response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="tubegenie-${content.topic.replace(/\s+/g, '-').toLowerCase()}.csv"`);

      // Send CSV
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export all content as CSV
   * GET /api/content/export/csv
   */
  async exportAllCSV(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      // Get all user's content
      const contents = await contentService.getUserContent(userId, 1000);

      if (contents.length === 0) {
        res.status(404).json({
          success: false,
          error: 'No content found to export',
        });
        return;
      }

      // Generate CSV
      const csv = exportService.generateCSV(contents);

      // Set response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="tubegenie-all-content.csv"');

      // Send CSV
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get content formatted for clipboard (plain text)
   * GET /api/content/:id/export/text
   */
  async exportText(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const content = await contentService.getContentById(id, userId);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      // Generate plain text
      const text = exportService.generatePlainText(content);

      res.status(200).json({
        success: true,
        data: {
          text,
          format: 'plain-text',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get content formatted as markdown
   * GET /api/content/:id/export/markdown
   */
  async exportMarkdown(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { id } = req.params;
      const content = await contentService.getContentById(id, userId);

      if (!content) {
        res.status(404).json({
          success: false,
          error: 'Content not found',
        });
        return;
      }

      // Generate markdown
      const markdown = exportService.generateMarkdown(content);

      res.status(200).json({
        success: true,
        data: {
          markdown,
          format: 'markdown',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user analytics dashboard
   * GET /api/content/analytics
   */
  async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = getUserId(req);
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      // Generate analytics
      const analytics = await analyticsService.generateUserAnalytics(userId);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const contentController = new ContentController();
