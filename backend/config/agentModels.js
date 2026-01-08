// Agent to model mapping configuration
export const agentModels = {
  explainer: {
    primary: 'gemini-1.5-flash',
    provider: 'gemini',
    fallback: {
      model: 'gpt-4o-mini',
      provider: 'openai'
    }
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
    primary: 'gemini-1.5-flash',
    provider: 'gemini',
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

