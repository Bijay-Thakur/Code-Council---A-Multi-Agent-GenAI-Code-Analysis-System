/**
 * Prompt templates for agents that enforce JSON output
 * All prompts follow strict schemas and use the shared system prompt
 */

import { SHARED_SYSTEM_PROMPT } from '../schemas/agentSchemas.js';

/**
 * (2) EXPLAINER AGENT PROMPT
 * Role: "Explainer Agent (Teaching Mode)"
 */
export function explainerPrompt(code, language) {
  const systemPrompt = "You are Code Council Explainer. Be specific and grounded in the provided code. Mention real identifiers (function names, variables, loops, conditions). You MUST return valid JSON only. Do not include markdown code blocks or headings.";
  
  const prompt = `Explain the following ${language} code in a teaching style. You MUST return valid JSON matching the schema below.

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY valid JSON (no markdown, no code blocks, no explanations outside JSON):
{
  "overview": "High-level overview referencing actual function names and structures from the code",
  "purpose": "Specific purpose and goal, what problem this code solves",
  "keyIdentifiers": ["actual function names", "variable names", "loop counters from the code"],
  "inputs": [{"name": "parameter name from code", "typeGuess": "type", "notes": "usage"}],
  "outputs": [{"name": "return/output name from code", "typeGuess": "type", "notes": "what it represents"}],
  "blockByBlock": [
    {
      "title": "Block title (e.g., 'Function mergeSort declaration', 'While loop for merging')",
      "whatHappens": "What this block does specifically, referencing actual variables and operations from the code",
      "whyItMatters": "Why this block is important",
      "identifiers": ["actual function names", "variable names", "etc. from code"]
    }
  ],
  "exampleTrace": [
    {
      "step": 1,
      "state": "Variable values at this step (e.g., 'arr=[3,1,4], length=3')",
      "explanation": "What happens at this step (e.g., 'Function checks if length <= 1, condition is false')"
    }
  ],
  "edgeCases": ["Edge case 1", "Edge case 2"],
  "improvements": ["Improvement 1", "Improvement 2"]
}

CRITICAL REQUIREMENTS:
- Must return ONLY valid JSON (no markdown, no code fences, no text outside JSON)
- Must reference at least 3 real identifiers from the code (function names, variables, loops, conditions)
- Must include at least 4 blockByBlock items describing different code sections
- Must include at least 1 edge case and 2 improvements
- Be specific: reference actual code elements, not generic patterns`;

  return { prompt, systemPrompt };
}

/**
 * (3) BUG HUNTER PROMPT
 * Role: "Bug Hunter Agent (Security + Reliability)"
 */
export function bugHunterPrompt(code, language) {
  const prompt = `Role: "Bug Hunter Agent (Security + Reliability)"

Analyze this ${language} code for bugs, vulnerabilities, security issues, and reliability problems:

\`\`\`${language}
${code}
\`\`\`

Return JSON in this EXACT schema:
{
  "summary": "Overall summary of findings (e.g., 'Found 2 critical issues: null pointer dereference and missing input validation')",
  "findings": [
    {
      "severity": "low|medium|high|critical",
      "title": "Issue title (e.g., 'Null pointer dereference in function processData')",
      "evidence": "Evidence from code (e.g., 'Line 15: arr[i] accessed without checking if arr is null')",
      "impact": "Impact if not fixed (e.g., 'Will cause runtime crash if null input provided')",
      "fix": "How to fix this issue (e.g., 'Add null check: if (arr === null) return;')"
    }
  ],
  "quickWins": [
    {
      "title": "Quick fix title",
      "diffHint": "Hint about what to change (not actual diff, e.g., 'Add validation check before line 10')"
    }
  ]
}

CRITICAL: Be specific about locations and evidence. Reference actual line numbers or code constructs when possible.`;

  return { prompt, systemPrompt: SHARED_SYSTEM_PROMPT };
}

/**
 * (4) COMPLEXITY PROMPT
 * Role: "Complexity Analyst Agent"
 */
export function complexityPrompt(code, language) {
  const systemPrompt = "You are Code Council Complexity Analyst. Analyze time and space complexity deterministically. For the same code, always return the same complexity analysis. Be precise and reference actual code constructs.";
  
  const prompt = `Analyze the time and space complexity of this ${language} code. Be deterministic - for identical code, you must return identical complexity analysis.

Code:
\`\`\`${language}
${code}
\`\`\`

You MUST return valid JSON only (no markdown, no code fences, no text outside JSON). Use this EXACT schema:
{
  "time": {
    "bigO": "Big O notation (e.g., 'O(n)', 'O(n log n)', 'O(n²)') - be precise and consistent",
    "reasoning": "Detailed reasoning for this complexity, referencing specific code constructs (loops, recursion depth, operations)"
  },
  "space": {
    "bigO": "Big O notation (e.g., 'O(1)', 'O(n)', 'O(log n)') - be precise and consistent",
    "reasoning": "Detailed reasoning for this complexity, referencing specific memory usage (call stack, auxiliary arrays, variables)"
  },
  "hotspots": [
    {
      "where": "Specific location in code (function name, loop, recursive call)",
      "why": "Why this is a performance hotspot with specific complexity reasoning"
    }
  ],
  "optimizations": [
    {
      "title": "Optimization suggestion title",
      "whatToChange": "Specific code changes to make (be concrete)",
      "expectedImpact": "Expected complexity improvement (e.g., 'Reduces time from O(n²) to O(n log n)')"
    }
  ]
}

CRITICAL REQUIREMENTS:
- Must return ONLY valid JSON (no markdown, no code fences, no explanations outside JSON)
- Complexity must be deterministic - analyze the code structure, count loops/recursions, identify dominant operations
- Reference actual code constructs (function names, loop counters, data structures)
- Be precise: O(n log n) is different from O(n), O(n²) is different from O(n log n)`;

  return { prompt, systemPrompt };
}

/**
 * (5) DEBATE ORCHESTRATOR PROMPT
 * Generates a single debate round
 */
export function debateRoundPrompt(topic, explainerResult, bugHunterResult, complexityResult, round, speaker, type, priorRounds = []) {
  const speakerMap = {
    1: { speaker: 'Explainer', type: 'claim' },
    2: { speaker: 'BugHunter', type: 'rebuttal' },
    3: { speaker: 'Complexity', type: 'counter' },
    4: { speaker: 'Explainer', type: 'response' },
    5: { speaker: 'BugHunter', type: 'rebuttal' },
    6: { speaker: 'Complexity', type: 'counter' }
  };

  const roundInfo = speakerMap[round] || { speaker, type };
  const actualSpeaker = roundInfo.speaker || speaker;
  const actualType = roundInfo.type || type;

  // Build context from prior rounds
  let priorContext = '';
  if (priorRounds.length > 0) {
    priorContext = '\n\nPrior debate rounds:\n' + priorRounds.map(r => 
      `Round ${r.round} - ${r.speaker} (${r.type}): ${r.claim}\nEvidence: ${r.evidence.join(', ')}\nRebuttals: ${r.rebuttals.join(', ') || 'None'}`
    ).join('\n\n');
  }

  // Safely stringify results and extract useful summary even from fallbacks
  const safeStringify = (obj, maxLength = 400) => {
    try {
      if (!obj || typeof obj !== 'object') {
        return 'No analysis available';
      }
      
      // Try to extract useful info even from fallback/error results
      let summary = '';
      if (obj.overview) {
        summary = `Overview: ${obj.overview}`;
        if (obj.purpose) summary += ` | Purpose: ${obj.purpose}`;
      } else if (obj.purpose) {
        summary = `Purpose: ${obj.purpose}`;
      } else if (obj.summary) {
        summary = `Summary: ${obj.summary}`;
      } else if (obj.whatItDoes) {
        summary = `What it does: ${obj.whatItDoes}`;
      } else if (obj.time && typeof obj.time === 'object' && obj.time.bigO) {
        summary = `Time: ${obj.time.bigO}, Space: ${obj.space?.bigO || 'N/A'}`;
      } else if (obj.findings && Array.isArray(obj.findings)) {
        summary = `${obj.findings.length} finding(s) identified`;
      } else if (obj.title) {
        summary = `Title: ${obj.title}`;
      }
      
      if (summary) {
        return summary.length > maxLength ? summary.substring(0, maxLength) + '...' : summary;
      }
      
      // Fallback to JSON stringify
      const str = JSON.stringify(obj);
      return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    } catch (e) {
      return 'Unable to stringify result';
    }
  };

  const systemPrompt = "You are Code Council Debate Orchestrator. Simulate a real debate with multiple back-and-forth rounds. Be specific and reference earlier rounds.";
  
  const prompt = `Debate Topic: "${topic}"

Simulate at least 5 rounds:
1) Explainer claim
2) BugHunter rebuttal
3) Complexity counter
4) Explainer response
5) Judge verdict

You are generating Round ${round} as the ${actualSpeaker} agent (${actualType}).

Agent analyses summary:
- Explainer: ${safeStringify(explainerResult)}
- BugHunter: ${safeStringify(bugHunterResult)}
- Complexity: ${safeStringify(complexityResult)}${priorContext}

You MUST return valid JSON only (no markdown, no code fences, no text outside JSON). Use this EXACT schema:
{
  "round": ${round},
  "speaker": "${actualSpeaker}",
  "type": "${actualType}",
  "claim": "Your main claim or statement - be specific and reference code details and previous rounds",
  "evidence": ["Evidence point 1 from agent analysis", "Evidence point 2"],
  "rebuttals": ["Rebuttal to point from round X (if prior rounds exist)", "Rebuttal to point from round Y"],
  "concessions": ["Concession you're making about a valid point from previous rounds"],
  "proposedFixes": ["Specific fix proposal 1", "Specific fix proposal 2", "Specific fix proposal 3"]
}

CRITICAL REQUIREMENTS:
- Must return ONLY valid JSON (no markdown, no code fences, no explanations outside JSON)
- Each round must reference at least one specific point from a previous round (if prior rounds exist)
- Must include at least 1 concession and 1 rebuttal in this round
- Must propose at least 3 concrete fixes
- Make it feel like a REAL debate with back-and-forth engagement
- Reference actual code elements and findings from the agent analyses`;

  return { prompt, systemPrompt };
}

/**
 * (5) DEBATE JUDGE/VERDICT PROMPT
 * Generates final consensus and verdict
 */
export function debateVerdictPrompt(topic, rounds, explainerResult, bugHunterResult, complexityResult) {
  const safeStringify = (obj, maxLength = 300) => {
    try {
      if (!obj || typeof obj !== 'object') {
        return 'No analysis available';
      }
      
      // Extract useful summary
      if (obj.overview) return `Overview: ${obj.overview.substring(0, maxLength)}`;
      if (obj.purpose) return `Purpose: ${obj.purpose.substring(0, maxLength)}`;
      if (obj.summary) return `Summary: ${obj.summary.substring(0, maxLength)}`;
      if (obj.findings && Array.isArray(obj.findings)) {
        return `${obj.findings.length} finding(s): ${obj.summary?.substring(0, maxLength) || 'Analysis available'}`;
      }
      if (obj.time && typeof obj.time === 'object' && obj.time.bigO) {
        return `Time: ${obj.time.bigO}, Space: ${obj.space?.bigO || 'N/A'}`;
      }
      
      const str = JSON.stringify(obj);
      return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    } catch (e) {
      return 'Unable to stringify result';
    }
  };

  const prompt = `You are the Judge. Review this code debate and determine consensus.

Debate Topic: "${topic}"

All debate rounds:
${rounds.map(r => `Round ${r.round} - ${r.speaker} (${r.type}): ${r.claim}\nEvidence: ${r.evidence.join(', ')}\nRebuttals: ${r.rebuttals.join(', ') || 'None'}\nConcessions: ${r.concessions.join(', ') || 'None'}`).join('\n\n')}

Agent analyses:
- Explainer: ${safeStringify(explainerResult)}
- BugHunter: ${safeStringify(bugHunterResult)}
- Complexity: ${safeStringify(complexityResult)}

Return JSON in this EXACT schema for consensus:
{
  "isProductionReady": true|false,
  "topPriorities": [
    {
      "priority": 1,
      "item": "Most important action item",
      "why": "Why this is the top priority"
    },
    {
      "priority": 2,
      "item": "Second most important action item",
      "why": "Why this is the second priority"
    }
  ],
  "rationale": "Detailed rationale for the consensus, synthesizing all debate points"
}

CRITICAL: Synthesize all arguments. Consider what was debated. Provide prioritized action items.`;

  return { prompt, systemPrompt: SHARED_SYSTEM_PROMPT };
}

/**
 * (6) FINAL VERDICT (SUPERVISOR) PROMPT
 * Role: "Supervisor Agent"
 */
export function supervisorPrompt(code, language, explainerResult, bugHunterResult, complexityResult, debateResult) {
  const safeStringify = (obj, maxLength = 500) => {
    try {
      const str = JSON.stringify(obj);
      return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    } catch (e) {
      return 'Unable to stringify result';
    }
  };

  const prompt = `Role: "Supervisor Agent"

Synthesize a final verdict from all agent analyses. Generate an optimized version of the code.

Original code:
\`\`\`${language}
${code}
\`\`\`

Agent analyses:
- Explainer: ${safeStringify(explainerResult)}
- BugHunter: ${safeStringify(bugHunterResult)}
- Complexity: ${safeStringify(complexityResult)}
- Debate: ${safeStringify(debateResult)}

Return JSON in this EXACT schema:
{
  "summary": "Executive summary synthesizing all analyses (2-3 sentences)",
  "riskLevel": "low|medium|high",
  "prioritizedActions": [
    {
      "priority": 1,
      "action": "Most important action to take",
      "why": "Why this action is critical"
    },
    {
      "priority": 2,
      "action": "Second most important action",
      "why": "Why this action matters"
    }
  ],
  "optimizedCode": {
    "language": "${language}",
    "code": "Complete optimized code here. Must be runnable. Include all imports, fixes for bugs identified, performance optimizations, input validation, error handling. This should be a complete, production-ready version."
  },
  "notes": ["Note 1 about the optimization", "Note 2 about improvements made"]
}

CRITICAL: 
- The optimizedCode.code must be complete, runnable ${language} code
- Fix all bugs identified by BugHunter
- Apply performance optimizations suggested by Complexity
- Add missing imports, validation, error handling
- Keep the same language as input
- Make it production-ready`;

  return { prompt, systemPrompt: SHARED_SYSTEM_PROMPT };
}

/**
 * Orchestrator prompt (optional, for planning)
 */
export function orchestratorPrompt(code, language) {
  const prompt = `Create an analysis plan for this ${language} code. Return ONLY valid JSON with no markdown, no code blocks, no ### headings. Use this exact structure:

{
  "plan": "Brief analysis plan",
  "routing": ["Explainer", "BugHunter", "Complexity", "Debate", "Supervisor"]
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the JSON object, nothing else.`;

  const systemPrompt = SHARED_SYSTEM_PROMPT;
  return { prompt, systemPrompt };
}

/**
 * Extract JSON from response (legacy function for backward compatibility)
 */
export function extractJSON(response) {
  if (!response) return null;
  
  // Try direct parse
  try {
    return JSON.parse(response);
  } catch (e) {
    // Continue to extraction
  }
  
  // Try extracting from code blocks
  const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[1]);
    } catch (e2) {
      // Continue
    }
  }
  
  // Try finding JSON object in text
  const braceMatch = response.match(/\{[\s\S]*\}/);
  if (braceMatch) {
    try {
      return JSON.parse(braceMatch[0]);
    } catch (e3) {
      // Continue
    }
  }
  
  return null;
}
