import OpenAI from 'openai';
import { config } from './index';

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: config.openRouterApiKey,
  defaultHeaders: {
    'HTTP-Referer': config.siteUrl,
    'X-Title': config.siteName,
  },
});

// Available AI Models
export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capabilities: string[];
  isDefault: boolean;
}

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'tngtech/deepseek-r1t2-chimera:free',
    name: 'DeepSeek R1T2 Chimera',
    provider: 'TNG Technology',
    description:
      'Advanced reasoning model with superior problem-solving capabilities',
    capabilities: ['text-generation', 'reasoning', 'analysis'],
    isDefault: true,
  },
  {
    id: 'z-ai/glm-4.5-air:free',
    name: 'GLM 4.5 Air',
    provider: 'Z-AI',
    description: 'Lightweight model optimized for speed and efficiency',
    capabilities: ['text-generation', 'fast-response'],
    isDefault: false,
  },
];

// Default model
export const DEFAULT_MODEL =
  AVAILABLE_MODELS.find((m) => m.isDefault)?.id || AVAILABLE_MODELS[0].id;

// Validate if a model ID exists
export function isValidModel(modelId: string): boolean {
  return AVAILABLE_MODELS.some((model) => model.id === modelId);
}

// Get model by ID
export function getModelById(modelId: string): AIModel | undefined {
  return AVAILABLE_MODELS.find((model) => model.id === modelId);
}
