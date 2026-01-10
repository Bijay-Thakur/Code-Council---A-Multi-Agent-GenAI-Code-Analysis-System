import { generateOpenAIResponse } from '../utils/openaiClient.js';
import { getAgentModel } from '../utils/modelHelper.js';
import { 
  explainerPrompt, 
  bugHunterPrompt, 
  complexityPrompt, 
  supervisorPrompt, 
  orchestratorPrompt,
  extractJSON 
} from '../prompts/agents.js';
import { runStructuredDebate } from '../services/debateService.js';
import {
  validateAgentResponse,
  ExplainerSchema,
  BugHunterSchema,
  ComplexitySchema,
  FinalVerdictSchema,
  createFallbackExplainer,
  createFallbackBugHunter,
  createFallbackComplexity,
  createFallbackFinalVerdict
} from '../schemas/agentSchemas.js';

// Generate trace ID
function generateTraceId() {
  return `trace-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Add log entry
function addLog(logs, level, message) {
  logs.push({
    ts: new Date().toISOString(),
    level,
    message
  });
}

// Stub responses for when API keys are missing (matching new schemas)
const stubs = {
  explainer: (code, language) => createFallbackExplainer(),
  
  bugHunter: (code, language) => createFallbackBugHunter(),
  
  complexity: (code, language) => createFallbackComplexity(),
  
  supervisor: (code, language) => createFallbackFinalVerdict(language, code),
  
  orchestrator: (code, language) => ({
    plan: `Analyzing ${language} code with multi-agent system. Will run Explainer, BugHunter, and Complexity agents in parallel, then conduct debate rounds, and finally synthesize results with Supervisor.`,
    routing: ['Explainer', 'BugHunter', 'Complexity', 'Debate', 'Supervisor']
  })
};

// Orchestrator agent
async function runOrchestrator(code, language, logs) {
  addLog(logs, 'info', 'Orchestrator: Creating analysis plan');
  
  const modelConfig = getAgentModel('orchestrator');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = orchestratorPrompt(code, language);
    
    let response;
    try {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    } catch (error) {
      addLog(logs, 'error', `Orchestrator API error: ${error.message}`);
      response = null;
    }
    
    if (response) {
      const parsed = extractJSON(response);
      if (parsed && parsed.plan && parsed.routing) {
        addLog(logs, 'info', 'Orchestrator: Plan created');
        return parsed;
      }
    }
  }
  
  addLog(logs, 'warn', 'Orchestrator: Using stub (no API key)');
  return stubs.orchestrator(code, language);
}

// Explainer agent with zod validation
async function runExplainer(code, language, logs) {
  addLog(logs, 'info', 'Explainer: Starting analysis');
  const modelConfig = getAgentModel('explainer');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = explainerPrompt(code, language);
    
    let response;
    try {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    } catch (error) {
      addLog(logs, 'error', `Explainer API error: ${error.message}`);
      response = null;
    }
    
    if (response) {
      // Log first 300 chars of response for debugging
      addLog(logs, 'info', `Explainer: Received response (${response.length} chars), preview: ${response.substring(0, 300).replace(/\n/g, ' ')}...`);
      
      // Validate with zod schema
      const validation = validateAgentResponse(response, ExplainerSchema, createFallbackExplainer);
      
      // Check if we got real data (not just fallback)
      const isFallback = validation.data && (
        validation.data.overview === 'Unable to parse explainer response' ||
        validation.data.overview === 'Code analysis is being processed. Please wait or check system logs.'
      );
      
      if (validation.valid && !isFallback) {
        addLog(logs, 'info', `Explainer: Analysis complete (validated) - overview: ${validation.data.overview?.substring(0, 60) || 'N/A'}...`);
        return validation.data;
      } else if (!isFallback || (validation.data && validation.data.overview && validation.data.overview !== 'Code analysis is being processed. Please wait or check system logs.')) {
        // Partial validation succeeded - we have some real data
        addLog(logs, 'warn', `Explainer: Partial validation - ${validation.errors?.length || 0} error(s), but using available data`);
        addLog(logs, 'info', `Explainer: Using data with overview: ${validation.data?.overview?.substring(0, 60) || 'N/A'}...`);
        return validation.data;
      } else {
        // Complete fallback - validation failed completely, but still return something
        addLog(logs, 'error', `Explainer: Validation completely failed - ${validation.errors?.slice(0, 3).join('; ') || 'Unknown error'}`);
        if (process.env.NODE_ENV !== 'production' && validation.rawText) {
          addLog(logs, 'error', `Explainer: Raw LLM output (first 1000 chars): ${validation.rawText.substring(0, 1000)}`);
        }
        // Still return the validation.data (which is fallback) so the system doesn't break
        return validation.data;
      }
    } else {
      addLog(logs, 'warn', 'Explainer: No response received from API');
    }
  }
  
  addLog(logs, 'warn', 'Explainer: Using stub (no API key or no response)');
  return stubs.explainer(code, language);
}

// Bug Hunter agent with zod validation
async function runBugHunter(code, language, logs) {
  addLog(logs, 'info', 'BugHunter: Starting analysis');
  const modelConfig = getAgentModel('bugHunter');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = bugHunterPrompt(code, language);
    
    let response;
    try {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    } catch (error) {
      addLog(logs, 'error', `BugHunter API error: ${error.message}`);
      response = null;
    }
    
    if (response) {
      // Validate with zod schema
      const validation = validateAgentResponse(response, BugHunterSchema, createFallbackBugHunter);
      if (validation.valid) {
        addLog(logs, 'info', 'BugHunter: Analysis complete (validated)');
        return validation.data;
      } else {
        addLog(logs, 'warn', `BugHunter validation errors: ${validation.errors.join(', ')}`);
        return validation.data;
      }
    }
  }
  
  addLog(logs, 'warn', 'BugHunter: Using stub (no API key)');
  return stubs.bugHunter(code, language);
}

// Complexity agent with zod validation
async function runComplexity(code, language, logs) {
  addLog(logs, 'info', 'Complexity: Starting analysis');
  const modelConfig = getAgentModel('complexity');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = complexityPrompt(code, language);
    
    let response;
    try {
      // Use lower temperature (0.2) for more deterministic complexity analysis
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true, 0.2);
    } catch (error) {
      addLog(logs, 'error', `Complexity API error: ${error.message}`);
      response = null;
    }
    
    if (response) {
      // Validate with zod schema
      const validation = validateAgentResponse(response, ComplexitySchema, createFallbackComplexity);
      if (validation.valid) {
        addLog(logs, 'info', 'Complexity: Analysis complete (validated)');
        return validation.data;
      } else {
        addLog(logs, 'warn', `Complexity validation errors: ${validation.errors.join(', ')}`);
        return validation.data;
      }
    }
  }
  
  addLog(logs, 'warn', 'Complexity: Using stub (no API key)');
  return stubs.complexity(code, language);
}

// Supervisor agent with zod validation
async function runSupervisor(code, language, explainerResult, bugHunterResult, complexityResult, debateResult, logs) {
  addLog(logs, 'info', 'Supervisor: Synthesizing final verdict');
  const modelConfig = getAgentModel('supervisor');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = supervisorPrompt(code, language, explainerResult, bugHunterResult, complexityResult, debateResult);
    
    let response;
    try {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    } catch (error) {
      addLog(logs, 'error', `Supervisor API error: ${error.message}`);
      response = null;
    }
    
    if (response) {
      // Validate with zod schema
      const validation = validateAgentResponse(response, FinalVerdictSchema, () => createFallbackFinalVerdict(language, code));
      if (validation.valid) {
        addLog(logs, 'info', 'Supervisor: Complete (validated)');
        return validation.data;
      } else {
        addLog(logs, 'warn', `Supervisor validation errors: ${validation.errors.join(', ')}`);
        // Ensure optimizedCode is present even if validation partially failed
        const result = validation.data;
        if (!result.optimizedCode || !result.optimizedCode.code) {
          result.optimizedCode = { language, code };
        }
        return result;
      }
    }
  }
  
  addLog(logs, 'warn', 'Supervisor: Using stub (no API key)');
  return stubs.supervisor(code, language);
}


export async function analyzeController(req, res) {
  const traceId = generateTraceId();
  const logs = [];
  
  try {
    addLog(logs, 'info', `Analysis started - traceId: ${traceId}`);
    console.log(`[backend] POST /api/analyze - traceId: ${traceId}`);
    
    const { code, language = 'javascript', options = {} } = req.body;
    
    // Validate input
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      addLog(logs, 'error', 'Invalid input: code is required');
      return res.status(400).json({
        error: "Code is required and must be a non-empty string",
        traceId
      });
    }
    
    // Log the code being analyzed (first 200 chars for debugging)
    console.log(`[backend] Analyzing code (${code.length} chars, language: ${language}):`, code.substring(0, 200) + (code.length > 200 ? '...' : ''));
    addLog(logs, 'info', `Received code: ${code.length} characters, language: ${language}`);
    
    // Step 1: Orchestrator creates plan
    const orchestratorResult = await runOrchestrator(code, language, logs);
    
    // Step 2: Run Explainer, BugHunter, Complexity in parallel
    addLog(logs, 'info', 'Running Explainer, BugHunter, Complexity in parallel');
    let explainerResult, bugHunterResult, complexityResult;
    try {
      [explainerResult, bugHunterResult, complexityResult] = await Promise.all([
        runExplainer(code, language, logs).catch(err => {
          addLog(logs, 'error', `Explainer error: ${err.message}`);
          return stubs.explainer(code, language);
        }),
        runBugHunter(code, language, logs).catch(err => {
          addLog(logs, 'error', `BugHunter error: ${err.message}`);
          return stubs.bugHunter(code, language);
        }),
        runComplexity(code, language, logs).catch(err => {
          addLog(logs, 'error', `Complexity error: ${err.message}`);
          return stubs.complexity(code, language);
        })
      ]);
    } catch (error) {
      addLog(logs, 'error', `Error running parallel agents: ${error.message}`);
      throw error;
    }
    
    // Step 3: Run Structured Debate
    addLog(logs, 'info', 'Running structured debate');
    let debateResult;
    try {
      debateResult = await runStructuredDebate(explainerResult, bugHunterResult, complexityResult, logs, addLog);
    } catch (error) {
      addLog(logs, 'error', `Debate error: ${error.message}`);
      debateResult = {
        topic: "Is this code production-ready? What should be improved first?",
        rounds: [],
        consensus: {
          isProductionReady: false,
          topPriorities: [],
          rationale: 'Debate service encountered an error'
        }
      };
    }
    
    // Step 4: Run Supervisor
    let supervisorResult;
    try {
      supervisorResult = await runSupervisor(code, language, explainerResult, bugHunterResult, complexityResult, debateResult, logs);
    } catch (error) {
      addLog(logs, 'error', `Supervisor error: ${error.message}`);
      supervisorResult = stubs.supervisor(code, language);
    }
    
    addLog(logs, 'info', 'Analysis complete');
    
    // Return exact structure - using both 'supervisor' (for backward compat) and 'finalVerdict' (as per spec)
    return res.json({
      traceId,
      results: {
        orchestrator: orchestratorResult,
        explainer: explainerResult,
        bugHunter: bugHunterResult,
        complexity: complexityResult,
        debate: debateResult,
        supervisor: supervisorResult,  // Keep for backward compatibility
        finalVerdict: supervisorResult  // New name as per spec
      },
      logs
    });
    
  } catch(error) {
    console.error(`[backend] Analyze error (traceId: ${traceId}):`, error);
    console.error(`[backend] Error stack:`, error.stack);
    addLog(logs, 'error', `Analysis failed: ${error.message}`);
    addLog(logs, 'error', `Error stack: ${error.stack}`);
    
    return res.status(500).json({
      error: "Failed to process analysis request",
      message: error.message,
      traceId,
      logs
    });
  }
}
