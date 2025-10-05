import { Content, IContent } from '../models/Content';
import { aiService, ContentGenerationResult } from './ai.service';
import { DEFAULT_MODEL } from '../config/ai.config';

export class ContentService {
  /**
   * Generate content for a topic and save to database
   * @param userId - User ID from Clerk
   * @param topic - Topic to generate content about
   * @param modelId - AI model to use (optional, defaults to DEFAULT_MODEL)
   */
  async generateAndSaveContent(
    userId: string,
    topic: string,
    modelId?: string
  ): Promise<IContent> {
    try {
      const selectedModel = modelId || DEFAULT_MODEL;
      
      // Generate content using AI with selected model
      const generatedContent: ContentGenerationResult = await aiService.generateContent(topic, selectedModel);

      // Create and save to database
      const content = new Content({
        userId,
        topic,
        titles: generatedContent.titles,
        description: generatedContent.description,
        tags: generatedContent.tags,
        thumbnailIdeas: generatedContent.thumbnailIdeas,
        scriptOutline: generatedContent.scriptOutline,
        aiModel: selectedModel,
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

  /**
   * Toggle favorite status
   */
  async toggleFavorite(contentId: string, userId: string): Promise<IContent | null> {
    try {
      const content = await Content.findOne({ _id: contentId, userId });
      if (!content) {
        return null;
      }
      
      content.isFavorite = !content.isFavorite;
      await content.save();
      return content;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }

  /**
   * Get favorite content
   */
  async getFavorites(userId: string): Promise<IContent[]> {
    try {
      const favorites = await Content.find({ userId, isFavorite: true })
        .sort({ createdAt: -1 });
      return favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  /**
   * Search content by keyword
   * Searches in topic, titles, description, tags, and script outline
   */
  async searchContent(userId: string, keyword: string): Promise<IContent[]> {
    try {
      if (!keyword || keyword.trim() === '') {
        return [];
      }

      const searchRegex = new RegExp(keyword, 'i'); // Case-insensitive search
      
      const results = await Content.find({
        userId,
        $or: [
          { topic: searchRegex },
          { titles: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { scriptOutline: searchRegex },
        ],
      }).sort({ createdAt: -1 });

      return results;
    } catch (error) {
      console.error('Error searching content:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();
