import { Content, IContent } from '../models/Content';
import { getModelById } from '../config/ai.config';

export interface AnalyticsSummary {
  totalContent: number;
  totalFavorites: number;
  contentByModel: {
    modelId: string;
    modelName: string;
    count: number;
    percentage: number;
  }[];
  topTopics: {
    topic: string;
    count: number;
    lastGenerated: Date;
  }[];
  generationTimeline: {
    date: string;
    count: number;
  }[];
  recentActivity: {
    contentId: string;
    topic: string;
    createdAt: Date;
    aiModel: string;
    isFavorite: boolean;
  }[];
  usageStats: {
    thisWeek: number;
    thisMonth: number;
    allTime: number;
    averagePerWeek: number;
  };
  tagCloud: {
    tag: string;
    count: number;
  }[];
}

export class AnalyticsService {
  /**
   * Generate comprehensive analytics for a user
   * @param userId - User ID from Clerk
   * @returns Analytics summary with stats and insights
   */
  async generateUserAnalytics(userId: string): Promise<AnalyticsSummary> {
    try {
      // Fetch all user's content
      const allContent = await Content.find({ userId }).sort({ createdAt: -1 });

      if (allContent.length === 0) {
        return this.getEmptyAnalytics();
      }

      // Calculate total content and favorites
      const totalContent = allContent.length;
      const totalFavorites = allContent.filter((c) => c.isFavorite).length;

      // Calculate content by AI model
      const contentByModel = this.calculateContentByModel(allContent);

      // Calculate top topics
      const topTopics = this.calculateTopTopics(allContent);

      // Calculate generation timeline (last 30 days)
      const generationTimeline = this.calculateTimeline(allContent);

      // Get recent activity (last 10 items)
      const recentActivity = this.getRecentActivity(allContent);

      // Calculate usage stats
      const usageStats = this.calculateUsageStats(allContent);

      // Generate tag cloud
      const tagCloud = this.generateTagCloud(allContent);

      return {
        totalContent,
        totalFavorites,
        contentByModel,
        topTopics,
        generationTimeline,
        recentActivity,
        usageStats,
        tagCloud,
      };
    } catch (error) {
      console.error('Error generating analytics:', error);
      throw new Error('Failed to generate analytics');
    }
  }

  /**
   * Calculate content distribution by AI model
   */
  private calculateContentByModel(
    content: IContent[]
  ): AnalyticsSummary['contentByModel'] {
    const modelCounts = new Map<string, number>();
    const modelNames = new Map<string, string>();

    content.forEach((item) => {
      const modelId = item.aiModel;
      modelCounts.set(modelId, (modelCounts.get(modelId) || 0) + 1);

      // Extract model name from ID
      if (!modelNames.has(modelId)) {
        const name = this.extractModelName(modelId);
        modelNames.set(modelId, name);
      }
    });

    const total = content.length;
    const result = Array.from(modelCounts.entries())
      .map(([modelId, count]) => ({
        modelId,
        modelName: modelNames.get(modelId) || modelId,
        count,
        percentage: Math.round((count / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    return result;
  }

  /**
   * Extract readable model name from model ID
   */
  private extractModelName(modelId: string): string {
    // Try to get the official model name from config
    const model = getModelById(modelId);
    if (model) {
      return model.name;
    }

    // Fallback to parsing the model ID
    if (modelId.includes('deepseek')) return 'DeepSeek';
    if (modelId.includes('gemini')) return 'Gemini';
    if (modelId.includes('glm')) return 'GLM';
    return modelId.split('/').pop()?.split(':')[0] || modelId;
  }

  /**
   * Calculate top topics with frequency
   */
  private calculateTopTopics(
    content: IContent[]
  ): AnalyticsSummary['topTopics'] {
    const topicMap = new Map<string, { count: number; lastGenerated: Date }>();

    content.forEach((item) => {
      const topic = item.topic.toLowerCase();
      const existing = topicMap.get(topic);

      if (existing) {
        existing.count++;
        if (new Date(item.createdAt) > existing.lastGenerated) {
          existing.lastGenerated = new Date(item.createdAt);
        }
      } else {
        topicMap.set(topic, {
          count: 1,
          lastGenerated: new Date(item.createdAt),
        });
      }
    });

    return Array.from(topicMap.entries())
      .map(([topic, data]) => ({
        topic,
        count: data.count,
        lastGenerated: data.lastGenerated,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 topics
  }

  /**
   * Calculate generation timeline for last 30 days
   */
  private calculateTimeline(
    content: IContent[]
  ): AnalyticsSummary['generationTimeline'] {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Initialize last 30 days with 0 counts
    const timeline = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      timeline.set(dateStr, 0);
    }

    // Count content per day
    content.forEach((item) => {
      const createdDate = new Date(item.createdAt);
      if (createdDate >= thirtyDaysAgo) {
        const dateStr = createdDate.toISOString().split('T')[0];
        timeline.set(dateStr, (timeline.get(dateStr) || 0) + 1);
      }
    });

    return Array.from(timeline.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Get recent activity
   */
  private getRecentActivity(
    content: IContent[]
  ): AnalyticsSummary['recentActivity'] {
    return content.slice(0, 10).map((item) => ({
      contentId: (item._id as any).toString(),
      topic: item.topic,
      createdAt: new Date(item.createdAt),
      aiModel: this.extractModelName(item.aiModel),
      isFavorite: item.isFavorite,
    }));
  }

  /**
   * Calculate usage statistics
   */
  private calculateUsageStats(
    content: IContent[]
  ): AnalyticsSummary['usageStats'] {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = content.filter(
      (c) => new Date(c.createdAt) >= weekAgo
    ).length;
    const thisMonth = content.filter(
      (c) => new Date(c.createdAt) >= monthAgo
    ).length;
    const allTime = content.length;

    // Calculate average per week
    const oldestContent = content[content.length - 1];
    const firstDate = oldestContent ? new Date(oldestContent.createdAt) : now;
    const weeksSinceFirst = Math.max(
      1,
      Math.ceil(
        (now.getTime() - firstDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
      )
    );
    const averagePerWeek = Math.round((allTime / weeksSinceFirst) * 10) / 10;

    return {
      thisWeek,
      thisMonth,
      allTime,
      averagePerWeek,
    };
  }

  /**
   * Generate tag cloud from all tags
   */
  private generateTagCloud(content: IContent[]): AnalyticsSummary['tagCloud'] {
    const tagCounts = new Map<string, number>();

    content.forEach((item) => {
      item.tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase().replace(/^#/, '');
        tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 tags
  }

  /**
   * Return empty analytics for users with no content
   */
  private getEmptyAnalytics(): AnalyticsSummary {
    return {
      totalContent: 0,
      totalFavorites: 0,
      contentByModel: [],
      topTopics: [],
      generationTimeline: [],
      recentActivity: [],
      usageStats: {
        thisWeek: 0,
        thisMonth: 0,
        allTime: 0,
        averagePerWeek: 0,
      },
      tagCloud: [],
    };
  }
}

export const analyticsService = new AnalyticsService();
