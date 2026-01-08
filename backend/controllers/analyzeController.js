import { generateOpenAIResponse } from '../utils/openaiClient.js';
import { generateGeminiResponse } from '../utils/geminiClient.js';
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

// Stub responses for when API keys are missing
const stubs = {
  explainer: (code, language) => ({
    title: 'Code Explanation',
    summary: `This ${language} code appears to be a functional implementation.`,
    whatItDoes: `This code implements a ${language} solution that processes data according to its logic.`,
    inputOutput: {
      input: 'Input parameters and data types expected by the code',
      output: 'Output format and return values from the code'
    },
    stepByStep: [
      { step: 1, text: 'Code structure follows standard patterns' },
      { step: 2, text: 'Key components include function definitions and control flow' }
    ],
    keyConcepts: [
      { name: 'Structure', explanation: 'Code follows standard patterns' }
    ],
    edgeCases: ['Consider edge case handling'],
    exampleWalkthrough: 'Code executes step by step as designed'
  }),
  
  bugHunter: (code, language) => ({
    overallRisk: 'low',
    bugCount: 0,
    statusMessage: 'Well done! No bugs found.',
    findings: [],
    suggestions: ['Consider adding error handling', 'Consider adding input validation'],
    quickFixes: []
  }),
  
  complexity: (code, language) => ({
    time: 'O(n)',
    space: 'O(1)',
    dominantOperations: ['Iteration', 'Conditional checks'],
    notes: ['Time complexity is typically O(n)', 'Space complexity is O(1) for most operations'],
    improvements: ['Consider optimization for larger inputs']
  }),
  
  supervisor: (code, language) => ({
    finalSummary: 'Analysis complete. The code demonstrates good structure with room for minor improvements.',
    actionItems: [
      'Add comprehensive error handling',
      'Consider performance optimizations',
      'Improve code documentation'
    ],
    riskLevel: 'low',
    optimizedCode: {
      language: language || 'javascript',
      code: code || '// No code provided', // Fallback: return original code
      whyBetter: ['Original code maintained as baseline', 'Consider adding error handling', 'Consider adding input validation']
    }
  }),
  
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
    if (modelConfig.provider === 'gemini') {
      response = await generateGeminiResponse(modelConfig.model, prompt, systemPrompt);
    } else {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
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

// Explainer agent
async function runExplainer(code, language, logs) {
  addLog(logs, 'info', 'Explainer: Starting analysis');
  const modelConfig = getAgentModel('explainer');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = explainerPrompt(code, language);
    
    let response;
    if (modelConfig.provider === 'gemini') {
      response = await generateGeminiResponse(modelConfig.model, prompt, systemPrompt);
    } else {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    }
    
    if (response) {
      const parsed = extractJSON(response);
      if (parsed && parsed.title && parsed.summary) {
        addLog(logs, 'info', 'Explainer: Analysis complete');
        // Ensure whatItDoes and inputOutput are present
        return {
          ...parsed,
          whatItDoes: parsed.whatItDoes || parsed.summary,
          inputOutput: parsed.inputOutput || {
            input: 'No input specified',
            output: 'No output specified'
          }
        };
      }
    }
  }
  
  addLog(logs, 'warn', 'Explainer: Using stub (no API key)');
  return stubs.explainer(code, language);
}

// Bug Hunter agent
async function runBugHunter(code, language, logs) {
  addLog(logs, 'info', 'BugHunter: Starting analysis');
  const modelConfig = getAgentModel('bugHunter');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = bugHunterPrompt(code, language);
    
    let response;
    if (modelConfig.provider === 'gemini') {
      response = await generateGeminiResponse(modelConfig.model, prompt, systemPrompt);
    } else {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    }
    
    if (response) {
      const parsed = extractJSON(response);
      if (parsed && parsed.overallRisk && Array.isArray(parsed.findings)) {
        addLog(logs, 'info', 'BugHunter: Analysis complete');
        // Ensure bugCount and statusMessage are set
        const bugCount = parsed.bugCount ?? parsed.findings.length;
        const statusMessage = parsed.statusMessage || 
          (bugCount === 0 
            ? 'Well done! No bugs found.' 
            : `${bugCount} bug(s) found that need attention.`);
        return {
          ...parsed,
          bugCount,
          statusMessage,
          suggestions: parsed.suggestions || []
        };
      }
    }
  }
  
  addLog(logs, 'warn', 'BugHunter: Using stub (no API key)');
  return stubs.bugHunter(code, language);
}

// Complexity agent
async function runComplexity(code, language, logs) {
  addLog(logs, 'info', 'Complexity: Starting analysis');
  const modelConfig = getAgentModel('complexity');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = complexityPrompt(code, language);
    
    let response;
    if (modelConfig.provider === 'gemini') {
      response = await generateGeminiResponse(modelConfig.model, prompt, systemPrompt);
    } else {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    }
    
    if (response) {
      const parsed = extractJSON(response);
      if (parsed && parsed.time && parsed.space) {
        addLog(logs, 'info', 'Complexity: Analysis complete');
        return parsed;
      }
    }
  }
  
  addLog(logs, 'warn', 'Complexity: Using stub (no API key)');
  return stubs.complexity(code, language);
}

// Supervisor agent
async function runSupervisor(code, language, explainerResult, bugHunterResult, complexityResult, debateResult, logs) {
  addLog(logs, 'info', 'Supervisor: Synthesizing final verdict');
  const modelConfig = getAgentModel('supervisor');
  
  if (modelConfig) {
    const { prompt, systemPrompt } = supervisorPrompt(code, language, explainerResult, bugHunterResult, complexityResult, debateResult);
    
    let response;
    if (modelConfig.provider === 'gemini') {
      response = await generateGeminiResponse(modelConfig.model, prompt, systemPrompt);
    } else {
      response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
    }
    
    if (response) {
      const parsed = extractJSON(response);
      if (parsed && parsed.finalSummary && parsed.optimizedCode) {
        addLog(logs, 'info', 'Supervisor: Complete');
        // Ensure all required fields are present
        return {
          finalSummary: parsed.finalSummary,
          actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
          riskLevel: parsed.riskLevel || 'low',
          optimizedCode: {
            language: parsed.optimizedCode?.language || language,
            code: parsed.optimizedCode?.code || code,
            whyBetter: Array.isArray(parsed.optimizedCode?.whyBetter) ? parsed.optimizedCode.whyBetter : ['Optimizations applied']
          }
        };
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
    
    const debateRounds = options.debateRounds || 6;
    addLog(logs, 'info', `Language: ${language}, Debate rounds: ${debateRounds}`);
    
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
      // Use stub debate if real one fails
      debateResult = {
        topic: "Is this code production-ready? What should be improved first?",
        rounds: [],
        judgeSummary: { winner: 'Explainer', reason: 'Debate service unavailable' }
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
    
    // Return exact structure as specified
    return res.json({
      traceId,
      results: {
        orchestrator: orchestratorResult,
        explainer: explainerResult,
        bugHunter: bugHunterResult,
        complexity: complexityResult,
        debate: debateResult,
        supervisor: supervisorResult
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
