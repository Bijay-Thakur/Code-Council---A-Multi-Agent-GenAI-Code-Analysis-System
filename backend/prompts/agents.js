/**
 * Prompt templates for agents that enforce JSON output
 */

function explainerPrompt(code, language) {
  const prompt = `Analyze and explain this ${language} code. You MUST provide CONCRETE, SPECIFIC answers based on the actual code. Do NOT use generic phrases like "processes data" or "implements a solution". 

Look at the code and determine:
1. What specific problem/algorithm it implements (e.g., "sorts an array", "searches for an element", "calculates fibonacci numbers")
2. What specific inputs it takes (e.g., "an unsorted array of integers", "a string and a pattern", "two numbers")
3. What specific outputs it produces (e.g., "a sorted array", "the index of the found element", "the nth fibonacci number")

Return ONLY valid JSON with no markdown, no code blocks, no ### headings. Use this exact structure:

{
  "title": "Specific, concrete title (e.g., 'Merge Sort Algorithm' or 'Binary Search Function')",
  "summary": "2-3 sentence summary that states the SPECIFIC purpose (e.g., 'This code implements the merge sort algorithm to sort an array of numbers in ascending order using a divide-and-conquer approach.')",
  "whatItDoes": "CONCRETE explanation of what this code accomplishes. Be SPECIFIC. Examples: 'This code sorts an unsorted array of numbers using the merge sort algorithm' or 'This code searches for a target value in a sorted array using binary search' or 'This code calculates the nth Fibonacci number using recursion'. DO NOT say generic things like 'processes data' or 'implements a solution'.",
  "inputOutput": {
    "input": "CONCRETE description of inputs. Be SPECIFIC about data types and what is expected. Examples: 'An unsorted array of integers (e.g., [3, 1, 4, 1, 5])' or 'A sorted array of numbers and a target number to search for' or 'A single integer n representing the position in the Fibonacci sequence'. Include parameter names if visible in the code.",
    "output": "CONCRETE description of outputs. Be SPECIFIC about what is returned. Examples: 'A sorted array of integers in ascending order (e.g., [1, 1, 3, 4, 5])' or 'The index of the target element if found, or -1 if not found' or 'The nth Fibonacci number as an integer'. State the exact return type and format."
  },
  "stepByStep": [
    {"step": 1, "text": "Specific explanation of what happens in the first step of the algorithm/logic"},
    {"step": 2, "text": "Specific explanation of what happens in the second step"}
  ],
  "keyConcepts": [
    {"name": "Specific concept name from the code", "explanation": "What this concept means in the context of this specific code"}
  ],
  "edgeCases": ["Specific edge case 1 (e.g., 'Empty array input')", "Specific edge case 2 (e.g., 'Array with single element')"],
  "exampleWalkthrough": "Detailed walkthrough with CONCRETE example. Use actual values. Example: 'If we call this function with [3, 1, 4], it first splits into [3] and [1, 4], then sorts [1, 4] to [1, 4], merges [3] with [1, 4] to produce [1, 3, 4]'"
}

CRITICAL: Analyze the ACTUAL code. If it's a sorting algorithm, say it sorts. If it's a search, say it searches. If it's a calculation, say what it calculates. Be CONCRETE and SPECIFIC, not generic.

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the JSON object, nothing else.`;

  const systemPrompt = `You are a senior software engineer and expert code explainer. You MUST return valid JSON only. Never use markdown headings like ###. 

CRITICAL INSTRUCTIONS:
- Analyze the ACTUAL code and provide CONCRETE, SPECIFIC answers
- DO NOT use generic phrases like "processes data", "implements a solution", "handles input/output"
- For "whatItDoes": State the SPECIFIC algorithm/problem (e.g., "sorts an array", "searches for element", "calculates fibonacci")
- For "input": State SPECIFIC data types and examples (e.g., "unsorted array of integers", "string and pattern")
- For "output": State SPECIFIC return type and format (e.g., "sorted array", "index or -1", "integer result")
- Be professional but CONCRETE - identify what the code actually does, not generic descriptions
- Look at function names, variable names, and logic to determine the specific purpose`;
  return { prompt, systemPrompt };
}

function bugHunterPrompt(code, language) {
  const prompt = `Analyze this ${language} code for bugs, vulnerabilities, and issues. Return ONLY valid JSON with no markdown, no code blocks, no ### headings. Use this exact structure:

{
  "overallRisk": "low|medium|high",
  "bugCount": 0,
  "statusMessage": "Well done! No bugs found." OR "X bug(s) found that need attention.",
  "findings": [
    {
      "severity": "low|medium|high",
      "title": "Issue title",
      "whyItMatters": "Why this matters",
      "whereInCode": "Location/line reference",
      "fix": "How to fix it"
    }
  ],
  "suggestions": ["Suggestion 1", "Suggestion 2"],
  "quickFixes": ["Quick fix 1", "Quick fix 2"]
}

IMPORTANT: 
- Set bugCount to the number of bugs found (0 if no bugs)
- If bugCount is 0, set statusMessage to "Well done! No bugs found."
- If bugCount > 0, set statusMessage to "{bugCount} bug(s) found that need attention."
- Always include suggestions array (even if empty, provide general improvement suggestions)
- quickFixes should be actionable fixes for the bugs found

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the JSON object, nothing else.`;

  const systemPrompt = `You are a bug hunter agent. You MUST return valid JSON only. Never use markdown headings like ###. Use plain strings in JSON. Be specific about severity and locations. Always provide bug count and status message. If no bugs found, congratulate the user with "Well done!" message.`;
  return { prompt, systemPrompt };
}

function complexityPrompt(code, language) {
  const prompt = `Analyze the time and space complexity of this ${language} code. Return ONLY valid JSON with no markdown, no code blocks, no ### headings. Use this exact structure:

{
  "time": "O(n)",
  "space": "O(1)",
  "dominantOperations": ["Operation 1", "Operation 2"],
  "notes": ["Note 1", "Note 2"],
  "improvements": ["Improvement 1", "Improvement 2"]
}

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Return ONLY the JSON object, nothing else.`;

  const systemPrompt = `You are a complexity analyst. You MUST return valid JSON only. Never use markdown headings like ###. Use plain strings in JSON. Provide accurate Big O notation.`;
  return { prompt, systemPrompt };
}

function debatePrompt(topic, explainerResult, bugHunterResult, complexityResult, round, role) {
  const priorRounds = round > 1 ? `\n\nPrevious rounds have been conducted. This is round ${round}.` : '';
  
  // Extract key points from results for better context
  const explainerKey = explainerResult?.whatItDoes || explainerResult?.summary || 'Code explanation available';
  const bugHunterKey = bugHunterResult?.overallRisk ? `Risk: ${bugHunterResult.overallRisk}, ${bugHunterResult.bugCount || 0} bugs found` : 'Bug analysis available';
  const complexityKey = complexityResult?.time ? `Time: ${complexityResult.time}, Space: ${complexityResult.space}` : 'Complexity analysis available';
  
  const stanceMap = {
    1: 'claim',
    2: 'rebuttal',
    3: 'counter',
    4: 'counter',
    5: 'counter',
    6: 'counter'
  };
  const currentStance = stanceMap[round] || 'counter';
  
  const prompt = `You are participating in an engaging, professional debate about code quality. Topic: "${topic}"

Previous agent analyses summary:
- Explainer: ${explainerKey}
- BugHunter: ${bugHunterKey}
- Complexity: ${complexityKey}${priorRounds}

Your role: ${role}
Round: ${round}
Stance: ${currentStance}

INSTRUCTIONS:
- Be engaging, conversational, and professional
- Reference specific findings from other agents
- Use evidence from the code analysis
- Make your argument compelling and clear
- If this is a rebuttal or counter, directly address points made by other agents
- Be specific about what should be improved and why
- Write as if you're speaking in a real code review meeting

Return ONLY valid JSON with no markdown, no code blocks, no ### headings. Use this exact structure:

{
  "round": ${round},
  "speaker": "${role}",
  "stance": "${currentStance}",
  "text": "Your engaging, professional argument that references specific findings and makes a compelling case",
  "evidence": ["Specific evidence point 1 from analysis", "Specific evidence point 2 from analysis"]
}

Return ONLY the JSON object, nothing else.`;

  const systemPrompt = `You are a professional debate participant in a code review discussion. You MUST return valid JSON only. Never use markdown headings like ###. Use plain strings in JSON. Be engaging, conversational, and professional. Make strong, evidence-based arguments. Reference specific findings from other agents. Make the debate interesting and informative.`;
  return { prompt, systemPrompt };
}

function supervisorPrompt(code, language, explainerResult, bugHunterResult, complexityResult, debateResult) {
  // Safely stringify results, handling circular references and large objects
  const safeStringify = (obj, maxLength = 800) => {
    try {
      const str = JSON.stringify(obj);
      return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    } catch (e) {
      return 'Unable to stringify result';
    }
  };
  
  const prompt = `Synthesize a final verdict from all agent analyses. Return ONLY valid JSON with no markdown, no code blocks, no ### headings. Use this exact structure:

{
  "finalSummary": "Comprehensive summary",
  "actionItems": ["Action 1", "Action 2"],
  "riskLevel": "low|medium|high",
  "optimizedCode": {
    "language": "${language}",
    "code": "Complete optimized code here (same language, improved)",
    "whyBetter": ["Reason 1", "Reason 2"]
  }
}

Original code:
\`\`\`${language}
${code}
\`\`\`

Agent analyses:
- Explainer: ${safeStringify(explainerResult)}
- BugHunter: ${safeStringify(bugHunterResult)}
- Complexity: ${safeStringify(complexityResult)}
- Debate: ${safeStringify(debateResult)}

IMPORTANT: The optimizedCode.code must be complete, runnable ${language} code that improves the original. Include all necessary imports, fix bugs, add validation, optimize performance.

Return ONLY the JSON object, nothing else.`;

  const systemPrompt = `You are a supervisor agent. You MUST return valid JSON only. Never use markdown headings like ###. Use plain strings in JSON. Generate complete, runnable optimized code.`;
  return { prompt, systemPrompt };
}

function orchestratorPrompt(code, language) {
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

  const systemPrompt = `You are an orchestrator agent. You MUST return valid JSON only. Never use markdown headings like ###. Use plain strings in JSON.`;
  return { prompt, systemPrompt };
}

/**
 * Extract JSON from response, handling code blocks and fallbacks
 */
function extractJSON(response) {
  if (!response) return null;
  
  // Try direct parse
  try {
    return JSON.parse(response);
  } catch (e) {
    // Try extracting from code blocks
    const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1]);
      } catch (e2) {
        // Continue to fallback
      }
    }
    
    // Try finding JSON object in text
    const braceMatch = response.match(/\{[\s\S]*\}/);
    if (braceMatch) {
      try {
        return JSON.parse(braceMatch[0]);
      } catch (e3) {
        // Continue to fallback
      }
    }
  }
  
  return null;
}

export {
  explainerPrompt,
  bugHunterPrompt,
  complexityPrompt,
  debatePrompt,
  supervisorPrompt,
  orchestratorPrompt,
  extractJSON
};
