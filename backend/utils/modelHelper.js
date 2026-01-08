import { agentModels } from '../config/agentModels.js';

/**
 * Get model configuration for an agent
 */
export function getAgentModel(agentName) {
  const config = agentModels[agentName];
  if (!config) return { model: 'gpt-4o-mini', provider: 'openai' };
  
  // Check if primary provider is available
  if (config.provider === 'gemini' && process.env.GEMINI_API_KEY) {
    return { model: config.primary, provider: 'gemini' };
  }
  if (config.provider === 'openai' && process.env.OPENAI_API_KEY) {
    return { model: config.primary, provider: 'openai' };
  }
  
  // Use fallback if available
  if (config.fallback) {
    if (config.fallback.provider === 'gemini' && process.env.GEMINI_API_KEY) {
      return { model: config.fallback.model, provider: 'gemini' };
    }
    if (config.fallback.provider === 'openai' && process.env.OPENAI_API_KEY) {
      return { model: config.fallback.model, provider: 'openai' };
    }
  }
  
  return null; // No API keys available
}
