import { agentModels } from '../config/agentModels.js';

/**
 * Get model configuration for an agent
 */
export function getAgentModel(agentName) {
  const config = agentModels[agentName];
  if (!config) return { model: 'gpt-4o-mini', provider: 'openai' };
  
  // Check if OpenAI API key is available
  if (process.env.OPENAI_API_KEY) {
    return { model: config.primary, provider: 'openai' };
  }
  
  // Use fallback if available and OpenAI key exists
  if (config.fallback && config.fallback.provider === 'openai' && process.env.OPENAI_API_KEY) {
    return { model: config.fallback.model, provider: 'openai' };
  }
  
  return null; // No API key available
}
