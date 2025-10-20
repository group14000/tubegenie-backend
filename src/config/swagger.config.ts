import swaggerJsdoc from 'swagger-jsdoc';
import { config } from './index';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'TubeGenie API',
    version: '1.0.0',
    description:
      'AI-Powered YouTube Content Generation API with advanced features including content favorites, search, export, and analytics dashboard.',
    contact: {
      name: 'TubeGenie Support',
      email: 'support@tubegenie.com',
    },
    license: {
      name: 'ISC',
      url: 'https://opensource.org/licenses/ISC',
    },
  },
  servers: [
    {
      url: config.apiUrl || `http://localhost:${config.port}`,
      description:
        config.nodeEnv === 'production'
          ? 'Production server'
          : 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Clerk JWT token obtained after authentication',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'string',
            example: 'Error message describing what went wrong',
          },
        },
      },
      ContentGeneration: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            example: 'AI in Healthcare 2025',
            description: 'Topic for YouTube content generation',
          },
          model: {
            type: 'string',
            example: 'tngtech/deepseek-r1t2-chimera:free',
            description: 'Optional AI model ID to use for generation',
          },
        },
        required: ['topic'],
      },
      GeneratedContent: {
        type: 'object',
        properties: {
          titles: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'AI in Healthcare: Top 5 Innovations 🏥',
              'Healthcare AI Revolution 2025 🤖',
            ],
          },
          description: {
            type: 'string',
            example: 'Discover how AI is transforming healthcare in 2025...',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            example: ['AI', 'Healthcare', 'Technology', 'Innovation'],
          },
          thumbnailIdeas: {
            type: 'array',
            items: { type: 'string' },
            example: ['AI + Healthcare 🏥', 'Future of Medicine 🤖'],
          },
          scriptOutline: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'Introduction',
              'Current AI Applications',
              'Future Trends',
              'Conclusion',
            ],
          },
          aiModel: {
            type: 'string',
            example: 'tngtech/deepseek-r1t2-chimera:free',
          },
        },
      },
      Content: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          userId: {
            type: 'string',
            example: 'user_2abc123def456',
          },
          topic: {
            type: 'string',
            example: 'AI in Healthcare',
          },
          titles: {
            type: 'array',
            items: { type: 'string' },
          },
          description: {
            type: 'string',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
          thumbnailIdeas: {
            type: 'array',
            items: { type: 'string' },
          },
          scriptOutline: {
            type: 'array',
            items: { type: 'string' },
          },
          isFavorite: {
            type: 'boolean',
            example: false,
          },
          aiModel: {
            type: 'string',
            example: 'tngtech/deepseek-r1t2-chimera:free',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-05T10:30:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2025-10-05T10:30:00.000Z',
          },
        },
      },
      AIModel: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'tngtech/deepseek-r1t2-chimera:free',
          },
          name: {
            type: 'string',
            example: 'DeepSeek R1T2 Chimera',
          },
          provider: {
            type: 'string',
            example: 'TNG Technology',
          },
          description: {
            type: 'string',
            example:
              'Advanced reasoning model with superior problem-solving capabilities',
          },
          capabilities: {
            type: 'array',
            items: { type: 'string' },
            example: ['text-generation', 'reasoning', 'analysis'],
          },
          isDefault: {
            type: 'boolean',
            example: true,
          },
        },
      },
      Analytics: {
        type: 'object',
        properties: {
          totalContent: {
            type: 'number',
            example: 42,
          },
          totalFavorites: {
            type: 'number',
            example: 12,
          },
          contentByModel: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                modelId: { type: 'string' },
                modelName: { type: 'string' },
                count: { type: 'number' },
                percentage: { type: 'number' },
              },
            },
          },
          topTopics: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                topic: { type: 'string' },
                count: { type: 'number' },
                lastGenerated: { type: 'string', format: 'date-time' },
              },
            },
          },
          usageStats: {
            type: 'object',
            properties: {
              thisWeek: { type: 'number' },
              thisMonth: { type: 'number' },
              allTime: { type: 'number' },
              averagePerWeek: { type: 'number' },
            },
          },
        },
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Authentication token is missing or invalid',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: 'User not authenticated',
            },
          },
        },
      },
      NotFoundError: {
        description: 'The requested resource was not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: 'Content not found',
            },
          },
        },
      },
      ValidationError: {
        description: 'Request validation failed',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: 'Topic is required and must be a non-empty string',
            },
          },
        },
      },
      RateLimitError: {
        description: 'Rate limit exceeded',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error',
            },
            example: {
              success: false,
              error: 'Too many requests. Please try again later.',
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Content Generation',
      description: 'AI-powered YouTube content generation',
    },
    {
      name: 'Content Management',
      description: 'Manage, search, and favorite content',
    },
    {
      name: 'Export',
      description: 'Export content in various formats',
    },
    {
      name: 'Analytics',
      description: 'Usage analytics and insights',
    },
    {
      name: 'Models',
      description: 'AI model information',
    },
    {
      name: 'Health',
      description: 'API health check',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to API routes
};

export const swaggerSpec = swaggerJsdoc(options);
