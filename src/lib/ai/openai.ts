import OpenAI from 'openai';

// Lazy initialization to prevent crash when env var is missing at build time
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey && process.env.NODE_ENV !== 'production') {
  console.warn('[Pixalified AI] OPENAI_API_KEY is not set. AI features will fail at runtime.');
}

export const openai = new OpenAI({
  apiKey: apiKey || 'placeholder-key-will-fail-at-runtime',
});

export const DEFAULT_MODEL = 'gpt-4o-mini';
