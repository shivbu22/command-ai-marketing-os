import Anthropic from '@anthropic-ai/sdk';
import { Groq } from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { openai } from './openai';

// Lazy initialization of providers
const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });
const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY || '' });
const getGemini = () => new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

export type LLMProvider = 'openai' | 'anthropic' | 'groq' | 'gemini';

export interface LLMRequest {
  provider: LLMProvider;
  model: string;
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export async function callLLM(request: LLMRequest): Promise<string> {
  const { provider, model, messages, temperature = 0.7, maxTokens = 1000 } = request;

  try {
    switch (provider) {
      case 'anthropic': {
        const anthropic = getAnthropic();
        const systemMessage = messages.find(m => m.role === 'system')?.content || '';
        const userMessages = messages.filter(m => m.role !== 'system').map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));

        const response = await anthropic.messages.create({
          model,
          system: systemMessage,
          messages: userMessages,
          max_tokens: maxTokens,
          temperature,
        });

        const firstContent = response.content[0];
        if (firstContent && 'text' in firstContent) {
          return firstContent.text;
        }
        return '';
      }

      case 'groq': {
        const groq = getGroq();
        const response = await groq.chat.completions.create({
          model,
          messages: messages as { role: 'system' | 'user' | 'assistant'; content: string }[],
          temperature,
          max_tokens: maxTokens,
        });
        return response.choices[0]?.message?.content || '';
      }

      case 'gemini': {
        const genAI = getGemini();
        const geminiModel = genAI.getGenerativeModel({ model });
        
        // Convert messages to Gemini format
        const history = messages.slice(0, -1).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }));
        const lastMessage = messages[messages.length - 1].content;

        const chat = geminiModel.startChat({ history: history as { role: string; parts: { text: string }[] }[] });
        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        return response.text();
      }

      case 'openai':
      default: {
        const response = await openai.chat.completions.create({
          model,
          messages: messages as { role: 'system' | 'user' | 'assistant'; content: string }[],
          temperature,
          max_tokens: maxTokens,
        });
        return response.choices[0]?.message?.content || '';
      }
    }
  } catch (error) {
    console.error(`[LLM Provider Error] ${provider}:`, error);
    // Fallback to Groq or Gemini if primary fails? 
    // For now, just re-throw
    throw error;
  }
}
