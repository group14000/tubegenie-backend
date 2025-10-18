import { openai, DEFAULT_MODEL } from '../config/ai.config';

export interface ContentGenerationResult {
    titles: string[];
    description: string;
    tags: string[];
    thumbnailIdeas: string[];
    scriptOutline: string[];
}

export class AIService {
    /**
     * Generate YouTube content ideas based on a topic using specified AI model
     * @param topic - The topic to generate content about
     * @param modelId - The AI model to use (defaults to DEFAULT_MODEL)
     */
    async generateContent(topic: string, modelId?: string): Promise<ContentGenerationResult> {
        try {
            const selectedModel = modelId || DEFAULT_MODEL;
            
            const prompt = `You are an expert YouTube content creator. Generate comprehensive YouTube content ideas for the following topic: "${topic}".

You MUST respond with ONLY a valid JSON object in this exact format (no additional text before or after):
{
  "titles": ["title 1", "title 2", "title 3"],
  "description": "An engaging video description",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "thumbnailIdeas": ["idea 1", "idea 2", "idea 3"],
  "scriptOutline": ["section 1", "section 2", "section 3", "section 4"]
}

Requirements:
- titles: Array of 2-3 catchy video titles with emojis
- description: A 2-3 sentence engaging video description  
- tags: Array of 5-8 relevant hashtags/keywords
- thumbnailIdeas: Array of 2-3 short, punchy thumbnail text ideas with emojis
- scriptOutline: Array of 4-6 main sections for the video script

IMPORTANT: Return ONLY the JSON object, no markdown code blocks, no explanatory text.`;

            // Try with response_format first, fall back if not supported
            let completion;
            try {
                completion = await openai.chat.completions.create({
                    model: selectedModel,
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful assistant that responds only with valid JSON objects. Never include markdown formatting or explanatory text."
                        },
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 1500,
                    response_format: { type: "json_object" },
                });
            } catch (formatError: any) {
                // If response_format is not supported, try without it
                if (formatError.message?.includes('response_format') || formatError.code === 'invalid_request_error') {
                    console.log(`Model ${selectedModel} doesn't support response_format, retrying without it...`);
                    completion = await openai.chat.completions.create({
                        model: selectedModel,
                        messages: [
                            {
                                role: "system",
                                content: "You are a helpful assistant that responds only with valid JSON objects. Never include markdown formatting or explanatory text."
                            },
                            {
                                role: "user",
                                content: prompt,
                            },
                        ],
                        temperature: 0.7,
                        max_tokens: 1500,
                    });
                } else {
                    throw formatError;
                }
            }

            const responseContent = completion.choices[0].message.content;

            if (!responseContent) {
                throw new Error('No content generated from AI model');
            }

            // Parse the JSON response
            const parsedContent = this.parseAIResponse(responseContent, selectedModel);
            return parsedContent;
        } catch (error: any) {
            console.error('Error generating content with AI:', error);
            
            // Provide more specific error messages
            if (error.message?.includes('JSON')) {
                throw new Error(`AI model returned invalid JSON format. Please try again or use a different model.`);
            }
            if (error.code === 'insufficient_quota') {
                throw new Error('AI service quota exceeded. Please try again later.');
            }
            if (error.status === 429) {
                throw new Error('Too many requests to AI service. Please wait a moment and try again.');
            }
            
            throw new Error(error.message || 'Failed to generate content with AI');
        }
    }

    /**
     * Parse AI response and extract JSON
     */
    private parseAIResponse(response: string, modelId: string): ContentGenerationResult {
        try {
            // Clean the response - remove markdown code blocks if present
            let cleanedResponse = response.trim();
            
            // Remove markdown code blocks (```json ... ``` or ``` ... ```)
            cleanedResponse = cleanedResponse.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
            
            // Try to extract JSON from the response
            const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error(`No JSON found in AI response from model ${modelId}:`, response.substring(0, 200));
                throw new Error('No valid JSON object found in AI response');
            }

            const parsed = JSON.parse(jsonMatch[0]);

            // Validate the structure and provide helpful error messages
            const requiredFields = ['titles', 'description', 'tags', 'thumbnailIdeas', 'scriptOutline'];
            const missingFields = requiredFields.filter(field => !parsed[field]);
            
            if (missingFields.length > 0) {
                console.error(`Missing fields in AI response from model ${modelId}:`, missingFields);
                console.error('Received structure:', Object.keys(parsed));
                throw new Error(`AI response missing required fields: ${missingFields.join(', ')}`);
            }

            // Validate array types
            if (!Array.isArray(parsed.titles) || parsed.titles.length === 0) {
                throw new Error('AI response must include an array of titles');
            }
            if (!Array.isArray(parsed.tags) || parsed.tags.length === 0) {
                throw new Error('AI response must include an array of tags');
            }
            if (!Array.isArray(parsed.thumbnailIdeas) || parsed.thumbnailIdeas.length === 0) {
                throw new Error('AI response must include an array of thumbnail ideas');
            }
            if (!Array.isArray(parsed.scriptOutline) || parsed.scriptOutline.length === 0) {
                throw new Error('AI response must include an array of script outline sections');
            }
            if (typeof parsed.description !== 'string' || parsed.description.trim() === '') {
                throw new Error('AI response must include a description string');
            }

            return {
                titles: parsed.titles,
                description: parsed.description,
                tags: parsed.tags,
                thumbnailIdeas: parsed.thumbnailIdeas,
                scriptOutline: parsed.scriptOutline,
            };
        } catch (error: any) {
            console.error(`Error parsing AI response from model ${modelId}:`, error.message);
            console.error('Raw response preview:', response.substring(0, 300));
            throw new Error(`Failed to parse AI response: ${error.message}`);
        }
    }
}

export const aiService = new AIService();
