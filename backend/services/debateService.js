import { generateOpenAIResponse } from '../utils/openaiClient.js';
import { generateGeminiResponse } from '../utils/geminiClient.js';
import { getAgentModel } from '../utils/modelHelper.js';
import { debatePrompt, extractJSON } from '../prompts/agents.js';

/**
 * Real debate protocol with structured rounds
 */
export async function runStructuredDebate(explainerResult, bugHunterResult, complexityResult, logs, addLog) {
  try {
    const topic = "Is this code production-ready? What should be improved first?";
    addLog(logs, 'info', `Debate: Starting structured debate on "${topic}"`);
    
    const modelConfig = getAgentModel('debate');
    if (!modelConfig) {
      addLog(logs, 'warn', 'Debate: No model available, using stub');
      return createStubDebate();
    }

    const rounds = [];
    
    // Round 1: Explainer claim
    addLog(logs, 'info', 'Debate: Round 1 - Explainer claim');
    const round1 = await generateDebateRound(modelConfig, topic, explainerResult, bugHunterResult, complexityResult, 1, 'Explainer', 'claim', logs);
    if (round1) rounds.push(round1);

    // Round 2: BugHunter rebuttal
    addLog(logs, 'info', 'Debate: Round 2 - BugHunter rebuttal');
    const round2 = await generateDebateRound(modelConfig, topic, explainerResult, bugHunterResult, complexityResult, 2, 'BugHunter', 'rebuttal', logs, rounds);
    if (round2) rounds.push(round2);

    // Round 3: Complexity counter
    addLog(logs, 'info', 'Debate: Round 3 - Complexity counter');
    const round3 = await generateDebateRound(modelConfig, topic, explainerResult, bugHunterResult, complexityResult, 3, 'Complexity', 'counter', logs, rounds);
    if (round3) rounds.push(round3);

    // Round 4: Explainer counter
    addLog(logs, 'info', 'Debate: Round 4 - Explainer counter');
    const round4 = await generateDebateRound(modelConfig, topic, explainerResult, bugHunterResult, complexityResult, 4, 'Explainer', 'counter', logs, rounds);
    if (round4) rounds.push(round4);

    // Round 5: BugHunter counter
    addLog(logs, 'info', 'Debate: Round 5 - BugHunter counter');
    const round5 = await generateDebateRound(modelConfig, topic, explainerResult, bugHunterResult, complexityResult, 5, 'BugHunter', 'counter', logs, rounds);
    if (round5) rounds.push(round5);

    // Round 6: Complexity closing
    addLog(logs, 'info', 'Debate: Round 6 - Complexity closing');
    const round6 = await generateDebateRound(modelConfig, topic, explainerResult, bugHunterResult, complexityResult, 6, 'Complexity', 'counter', logs, rounds);
    if (round6) rounds.push(round6);

    // Judge summary
    addLog(logs, 'info', 'Debate: Generating judge summary');
    const judgeSummary = await generateJudgeSummary(modelConfig, topic, rounds, explainerResult, bugHunterResult, complexityResult, logs);
    
    // Ensure we always return valid debate structure
    if (rounds.length === 0) {
      addLog(logs, 'warn', 'Debate: No rounds generated, using stub');
      return createStubDebate();
    }
    
    return {
      topic,
      rounds,
      judgeSummary: judgeSummary || { winner: 'Explainer', reason: 'No judge summary available' }
    };
  } catch (error) {
    addLog(logs, 'error', `Debate: Critical error in runStructuredDebate: ${error.message}`);
    addLog(logs, 'error', `Debate: Error stack: ${error.stack}`);
    // Always return valid debate structure even on error
    return createStubDebate();
  }
}

async function generateDebateRound(modelConfig, topic, explainerResult, bugHunterResult, complexityResult, round, speaker, stance, logs, priorRounds = []) {
  try {
    let { prompt, systemPrompt } = debatePrompt(topic, explainerResult, bugHunterResult, complexityResult, round, speaker);
    
    // Add context of prior rounds
    if (priorRounds.length > 0) {
      const priorContext = priorRounds.map(r => `Round ${r.round} - ${r.speaker} (${r.stance}): ${r.text}`).join('\n');
      prompt = prompt + `\n\nPrior debate rounds:\n${priorContext}`;
    }

    let response;
    try {
      if (modelConfig.provider === 'gemini') {
        response = await generateGeminiResponse(modelConfig.model, prompt, systemPrompt);
      } else {
        response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
      }
    } catch (apiError) {
      addLog(logs, 'error', `Debate: API error for round ${round} from ${speaker}: ${apiError.message}`);
      response = null;
    }

    if (!response) {
      addLog(logs, 'warn', `Debate: No response for round ${round} from ${speaker}`);
      // Return a fallback round instead of null
      return {
        round,
        speaker,
        stance,
        text: `Round ${round}: ${speaker} is presenting their ${stance} on the code quality.`,
        evidence: []
      };
    }

    const parsed = extractJSON(response);
    if (parsed && parsed.text) {
      return {
        round,
        speaker,
        stance: parsed.stance || stance,
        text: parsed.text,
        evidence: Array.isArray(parsed.evidence) ? parsed.evidence : []
      };
    }

    // Fallback - return a valid round structure
    addLog(logs, 'warn', `Debate: Failed to parse JSON for round ${round}, using fallback`);
    return {
      round,
      speaker,
      stance,
      text: response.substring(0, 500) || `Round ${round}: ${speaker} is presenting their ${stance}.`,
      evidence: []
    };
  } catch (error) {
    addLog(logs, 'error', `Debate: Error generating round ${round} from ${speaker}: ${error.message}`);
    // Always return a valid round structure
    return {
      round,
      speaker,
      stance,
      text: `Round ${round}: ${speaker} encountered an issue but is continuing the debate.`,
      evidence: []
    };
  }
}

async function generateJudgeSummary(modelConfig, topic, rounds, explainerResult, bugHunterResult, complexityResult, logs) {
  try {
    // Safely stringify results, handling circular references
    const safeStringify = (obj, maxLength = 300) => {
      try {
        const str = JSON.stringify(obj);
        return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
      } catch (e) {
        return 'Unable to stringify result';
      }
    };

    const prompt = `As an impartial judge, review this code debate and determine the winner.

Topic: "${topic}"

Debate rounds:
${rounds.map(r => `Round ${r.round} - ${r.speaker} (${r.stance}): ${r.text}`).join('\n\n')}

Agent analyses:
- Explainer: ${safeStringify(explainerResult)}
- BugHunter: ${safeStringify(bugHunterResult)}
- Complexity: ${safeStringify(complexityResult)}

Return ONLY valid JSON:
{
  "winner": "Explainer|BugHunter|Complexity",
  "reason": "Why this agent's perspective wins"
}`;

    const systemPrompt = 'You are an impartial judge. Return valid JSON only. Choose the agent whose perspective is most valuable for production code.';

    let response;
    try {
      if (modelConfig.provider === 'gemini') {
        response = await generateGeminiResponse(modelConfig.model, prompt, systemPrompt);
      } else {
        response = await generateOpenAIResponse(modelConfig.model, [{ role: 'user', content: prompt }], systemPrompt, true);
      }
    } catch (apiError) {
      addLog(logs, 'error', `Debate: Judge API error: ${apiError.message}`);
      response = null;
    }

    if (!response) {
      // Fallback: choose based on most findings
      const bugCount = bugHunterResult?.findings?.length || 0;
      if (bugCount > 2) return { winner: 'BugHunter', reason: 'Multiple critical issues identified' };
      return { winner: 'Explainer', reason: 'Code structure is sound' };
    }

    const parsed = extractJSON(response);
    if (parsed && ['Explainer', 'BugHunter', 'Complexity'].includes(parsed.winner)) {
      return {
        winner: parsed.winner,
        reason: parsed.reason || 'No reason provided'
      };
    }

    // Fallback: choose based on most findings
    const bugCount = bugHunterResult?.findings?.length || 0;
    if (bugCount > 2) return { winner: 'BugHunter', reason: 'Multiple critical issues identified' };
    return { winner: 'Explainer', reason: 'Code structure is sound' };
  } catch (error) {
    addLog(logs, 'error', `Debate: Error generating judge summary: ${error.message}`);
    // Always return a valid judge summary
    const bugCount = bugHunterResult?.findings?.length || 0;
    if (bugCount > 2) return { winner: 'BugHunter', reason: 'Multiple critical issues identified' };
    return { winner: 'Explainer', reason: 'Code structure is sound' };
  }
}

function createStubDebate() {
  return {
    topic: "Is this code production-ready? What should be improved first?",
    rounds: [
      {
        round: 1,
        speaker: 'Explainer',
        stance: 'claim',
        text: 'The code structure is clear and follows good practices.',
        evidence: ['Code is readable', 'Logic is sound']
      },
      {
        round: 2,
        speaker: 'BugHunter',
        stance: 'rebuttal',
        text: 'However, there are potential edge cases and missing error handling.',
        evidence: ['No input validation', 'Missing error handling']
      },
      {
        round: 3,
        speaker: 'Complexity',
        stance: 'counter',
        text: 'Performance could be optimized for larger inputs.',
        evidence: ['Time complexity can be improved']
      }
    ],
    judgeSummary: {
      winner: 'BugHunter',
      reason: 'Addressing bugs and edge cases is critical for production readiness.'
    }
  };
}
