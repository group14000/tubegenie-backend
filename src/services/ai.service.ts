import { openai, AI_MODEL } from '../config/ai.config';

export interface ContentGenerationResult {
    titles: string[];
    description: string;
    tags: string[];
    thumbnailIdeas: string[];
    scriptOutline: string[];
}

export class AIService {
    /**
     * Generate YouTube content ideas based on a topic using DeepSeek AI
     */
    async generateContent(topic: string): Promise<ContentGenerationResult> {
        try {
            const prompt = `You are an expert YouTube content creator. Generate comprehensive YouTube content ideas for the following topic: "${topic}".

Provide your response in the following JSON format:
{
  "titles": ["2-3 catchy video titles with emojis"],
  "description": "An engaging 2-3 sentence video description",
  "tags": ["5-8 relevant hashtags/keywords"],
  "thumbnailIdeas": ["2-3 thumbnail text ideas with emojis"],
  "scriptOutline": ["4-6 main sections for the video script"]
}

Make sure the titles are catchy, SEO-friendly, and include relevant emojis. The description should hook viewers. Tags should be searchable keywords. Thumbnail ideas should be short, punchy text. Script outline should cover the logical flow of the video.`;

            const completion = await openai.chat.completions.create({
                model: AI_MODEL,
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });

            const responseContent = completion.choices[0].message.content;

            if (!responseContent) {
                throw new Error('No content generated from AI');
            }

            // Parse the JSON response
            const parsedContent = this.parseAIResponse(responseContent);
            return parsedContent;
        } catch (error) {
            console.error('Error generating content with AI:', error);
            throw new Error('Failed to generate content');
        }
    }

    /**
     * Parse AI response and extract JSON
     */
    private parseAIResponse(response: string): ContentGenerationResult {
        try {
            // Try to extract JSON from the response (AI might include extra text)
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in AI response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Validate the structure
            if (!parsed.titles || !parsed.description || !parsed.tags ||
                !parsed.thumbnailIdeas || !parsed.scriptOutline) {
                throw new Error('Invalid response structure from AI');
            }

            return {
                titles: parsed.titles,
                description: parsed.description,
                tags: parsed.tags,
                thumbnailIdeas: parsed.thumbnailIdeas,
                scriptOutline: parsed.scriptOutline,
            };
        } catch (error) {
            console.error('Error parsing AI response:', error);
            throw new Error('Failed to parse AI response');
        }
    }
}

export const aiService = new AIService();
