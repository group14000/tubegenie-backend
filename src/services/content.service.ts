import { Content, IContent } from '../models/Content';
import { aiService, ContentGenerationResult } from './ai.service';

export class ContentService {
  /**
   * Generate content for a topic and save to database
   */
  async generateAndSaveContent(
    userId: string,
    topic: string
  ): Promise<IContent> {
    try {
      // Generate content using AI
      const generatedContent: ContentGenerationResult = await aiService.generateContent(topic);

      // Create and save to database
      const content = new Content({
        userId,
        topic,
        titles: generatedContent.titles,
        description: generatedContent.description,
        tags: generatedContent.tags,
        thumbnailIdeas: generatedContent.thumbnailIdeas,
        scriptOutline: generatedContent.scriptOutline,
      });

      await content.save();
      return content;
    } catch (error) {
      console.error('Error in generateAndSaveContent:', error);
      throw error;
    }
  }

  /**
   * Get user's content history
   */
  async getUserContent(userId: string, limit: number = 10): Promise<IContent[]> {
    try {
      const content = await Content.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
      return content;
    } catch (error) {
      console.error('Error fetching user content:', error);
      throw error;
    }
  }

  /**
   * Get content by ID
   */
  async getContentById(contentId: string, userId: string): Promise<IContent | null> {
    try {
      const content = await Content.findOne({ _id: contentId, userId });
      return content;
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }
  }

  /**
   * Delete content
   */
  async deleteContent(contentId: string, userId: string): Promise<boolean> {
    try {
      const result = await Content.deleteOne({ _id: contentId, userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();
