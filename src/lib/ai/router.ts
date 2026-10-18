import { LLMProvider } from './providers';

export interface ModelRouting {
  provider: LLMProvider;
  model: string;
}

export type AgentRole = 
  | 'content_creator' 
  | 'trend_scout' 
  | 'seo_engine' 
  | 'social_manager' 
  | 'image_creator'
  | 'growth_strategy'
  | 'competitor_intel'
  | 'social_listening'
  | 'seo_agent'
  | 'geo_agent'
  | 'industry_news'
  | 'pr_outreach'
  | 'cro_agent'
  | 'memory_agent'
  | 'hallucination_validator'
  | 'content_safety';

const ROLE_TIERS: Record<AgentRole, 'CHEAP' | 'MID' | 'STRATEGY'> = {
  content_creator: 'MID',
  trend_scout: 'CHEAP',
  seo_engine: 'MID',
  social_manager: 'MID',
  image_creator: 'MID',
  growth_strategy: 'CHEAP',
  competitor_intel: 'MID',
  social_listening: 'CHEAP',
  seo_agent: 'MID',
  geo_agent: 'MID',
  industry_news: 'CHEAP',
  pr_outreach: 'MID',
  cro_agent: 'CHEAP',
  memory_agent: 'CHEAP',
  hallucination_validator: 'CHEAP',
  content_safety: 'CHEAP'
};

export function getAgentRouting(role: AgentRole): ModelRouting {
  const isDev = process.env.NODE_ENV === 'development';
  const hasGroq = !!process.env.GROQ_API_KEY;
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  const hasGemini = !!process.env.GOOGLE_AI_API_KEY;

  // Best Free Strategy (from Guide): Use Groq in development if available
  if (isDev && hasGroq) {
    return { provider: 'groq', model: 'llama-3.3-70b-versatile' };
  }

  const tier = ROLE_TIERS[role];

  if (hasClaude) {
    switch (tier) {
      case 'CHEAP':
        return { provider: 'anthropic', model: 'claude-3-5-haiku-latest' };
      case 'MID':
        return { provider: 'anthropic', model: 'claude-3-5-sonnet-latest' };
      case 'STRATEGY':
        return { provider: 'anthropic', model: 'claude-3-opus-latest' };
    }
  }

  // Fallback to Gemini Flash if Claude is missing
  if (hasGemini) {
    return { provider: 'gemini', model: 'gemini-1.5-flash' };
  }

  // Final fallback to OpenAI (original implementation)
  return { provider: 'openai', model: 'gpt-4o-mini' };
}
