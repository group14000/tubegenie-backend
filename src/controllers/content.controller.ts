import { Request, Response, NextFunction } from 'express';
import { contentService } from '../services/content.service';

// Helper function to extract userId from Clerk auth
function getUserId(req: Request): string | null {
  const auth = req.auth as any;
  return auth?.userId || auth?.sessionClaims?.sub || auth?.subject || null;
}

export class ContentController {
  /**
   * Generate YouTube content based on topic
   * POST /api/content/generate
   */
  async generateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topic } = req.body;

      // Validate request
      if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Topic is required and must be a non-empty string',
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

      // Generate and save content
      const content = await contentService.generateAndSaveContent(userId, topic.trim());

      res.status(201).json({
        success: true,
        data: {
          titles: content.titles,
          description: content.description,
          tags: content.tags,
          thumbnailIdeas: content.thumbnailIdeas,
          scriptOutline: content.scriptOutline,
        },
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
}

export const contentController = new ContentController();
