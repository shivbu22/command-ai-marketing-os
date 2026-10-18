import { runAgent, AgentRole } from './agents';
import { openai, DEFAULT_MODEL } from './openai';
import { getKnowledgeContext } from './knowledge-retrieval';

export interface OrchestrationResult {
  agentRole: AgentRole;
  task: string;
}

export async function orchestrate(command: string): Promise<OrchestrationResult> {
  // Sanitize user input to mitigate prompt injection
  const sanitizedCommand = command
    .replace(/[`'"{}]/g, '')  // Strip special characters
    .slice(0, 500);           // Limit command length

  const classificationPrompt = `
    You are the Pixalified AI Master Orchestrator. 
    Your job is to categorize a user command into one of five specialized marketing agents:
    1. content_creator: For generating text, blogs, posts, or scripts.
    2. trend_scout: For analyzing trends, hashtags, or competitor moves.
    3. seo_engine: For keyword research, meta tags, and reach optimization.
    4. social_manager: For scheduling, posting times, and cross-platform strategy.
    5. image_creator: For designing graphics, icons, social media images, or visual concepts.

    User Command: "${sanitizedCommand}"

    Respond ONLY with a JSON object in this format:
    {
      "agentRole": "content_creator" | "trend_scout" | "seo_engine" | "social_manager" | "image_creator",
      "task": "A refined version of the user command for the specific agent"
    }
  `;

  const response = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages: [{ role: 'system', content: classificationPrompt }],
    response_format: { type: 'json_object' },
    temperature: 0,
  });

  const result = JSON.parse(response.choices[0].message.content || '{}');
  return result as OrchestrationResult;
}

export async function processCommand(command: string, context?: Record<string, unknown>) {
  // 1. Determine which agent to use
  const { agentRole, task } = await orchestrate(command);
  
  // 2. Retrieve relevant brand memory (RAG)
  const brandContext = await getKnowledgeContext(command);
  
  // 3. Execute agent with integrated memory
  const agentResponse = await runAgent(agentRole, task, { ...context, brandContext });
  
  return {
    ...agentResponse,
    originalCommand: command,
    refinedTask: task
  };
}
