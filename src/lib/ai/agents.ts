import { openai, DEFAULT_MODEL } from './openai';

export type AgentRole = 'content_creator' | 'trend_scout' | 'seo_engine' | 'social_manager' | 'image_creator';

export interface AgentResponse {
  agent: AgentRole;
  content: string;
  metadata?: Record<string, unknown>;
}

const AGENT_PROMPTS: Record<AgentRole, string> = {
  content_creator: `You are the Pixalified AI Content Creator. Your goal is to generate high-engagement social media content.
    When given a topic or directive, provide:
    1. A catchy headline or hook.
    2. Body copy optimized for the platform (Instagram, Twitter, or LinkedIn).
    3. Suggested hashtags.
    4. A brief description of the visual/graphic that should accompany this post.
    Format your response as markdown.`,
  
  trend_scout: `You are the Pixalified AI Trend Scout. Your goal is to identify viral trends and content opportunities.
    Analyze the user's industry and provided context to suggest:
    1. Current trending topics or hashtags.
    2. Why these are relevant to the user's product.
    3. A specific content angle to capitalize on the trend.
    Format your response as markdown.`,
  
  seo_engine: `You are the Pixalified AI SEO Engine. Your goal is to optimize content for search visibility and reach.
    Provide:
    1. A primary keyword and 3-5 secondary keywords.
    2. An optimized meta title and description.
    3. A brief SEO score of the current strategy.
    Format your response as markdown.`,
  
  social_manager: `You are the Pixalified AI Social Manager. Your goal is to optimize distribution and scheduling.
    Based on the content strategy, provide:
    1. A suggested posting schedule (dates/times).
    2. Recommendations for cross-platform adaptation.
    3. Engagement tips (questions to ask the audience).
    Format your response as markdown.`,

  image_creator: `You are the Pixalified AI Image Creator. Your goal is to design stunning marketing graphics.
    When asked for an image, translate the user's request into a highly detailed prompt for an AI image generator.
    Focus on vibrant colors, modern aesthetics, and social media appeal.
    Return only a professional description of the image you are creating.`
};

export async function runAgent(role: AgentRole, task: string, context?: Record<string, unknown>): Promise<AgentResponse> {
  const prompt = AGENT_PROMPTS[role];
  
  if (role === 'image_creator') {
    // 1. Refine the prompt using GPT
    const refinedPrompt = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: prompt + "\nRefine the user request into a DALL-E 3 prompt. Output only the prompt text." },
        { role: 'user', content: task }
      ]
    });

    const imagePrompt = refinedPrompt.choices[0].message.content || task;

    // 2. Generate the image
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    });

    const imageUrl = imageResponse.data && imageResponse.data.length > 0 
      ? imageResponse.data[0].url 
      : null;

    if (!imageUrl) {
      throw new Error("Failed to generate image URL from OpenAI.");
    }

    return {
      agent: role,
      content: `🎨 **I've designed the following graphic for you:**\n\n![Generated Image](${imageUrl})\n\n**Visual Concept:** ${imagePrompt}`,
      metadata: { imageUrl }
    };
  }

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: `Task: ${task}\n\nContext: ${JSON.stringify(context || {})}` }
    ],
    temperature: 0.7,
  });

  return {
    agent: role,
    content: response.choices[0].message.content || 'I encountered an error generating a response.',
  };
}
