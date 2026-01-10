// Agent to model mapping configuration - All using OpenAI
export const agentModels = {
  explainer: {
    primary: 'gpt-4o-mini',
    provider: 'openai',
    fallback: null
  },
  bugHunter: {
    primary: 'gpt-4o-mini',
    provider: 'openai',
    fallback: null
  },
  complexity: {
    primary: 'gpt-4o-mini',
    provider: 'openai',
    fallback: null
  },
  debate: {
    primary: 'gpt-4o', // Different model for debate as requested
    provider: 'openai',
    fallback: {
      model: 'gpt-4o-mini',
      provider: 'openai'
    }
  },
  supervisor: {
    primary: 'gpt-4o-mini',
    provider: 'openai',
    fallback: null
  },
  orchestrator: {
    primary: 'gpt-4o-mini',
    provider: 'openai',
    fallback: null
  }
};

