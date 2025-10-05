import OpenAI from 'openai';
import { config } from './index';

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: config.openRouterApiKey,
  defaultHeaders: {
    "HTTP-Referer": config.siteUrl,
    "X-Title": config.siteName,
  },
});

export const AI_MODEL = "deepseek/deepseek-chat-v3.1:free";
