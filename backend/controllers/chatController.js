import { generateOpenAIResponse } from '../utils/openaiClient.js';

export async function chatController(req, res) {
  try {
    console.log('[backend] POST /api/chat - Received chat request');
    
    const {message, history, context} = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('[backend] Error: Message is required');
      return res.status(400).json({error: "Message is required and must be a non-empty string"});
    }
    
    // Build context-aware system prompt
    let systemPrompt = "You are the Code Council assistant, a helpful AI that assists users with code analysis and development questions. Be friendly, professional, and concise. Help users understand code analysis results, answer questions about the multi-agent system, and provide coding guidance.\n\n";
    
    if (context && context.hasAnalysis) {
      systemPrompt += "CONTEXT - The user has analyzed code using Code Council. You have access to the following analysis results:\n\n";
      
      if (context.code) {
        systemPrompt += `ANALYZED CODE (first ${context.code.length} characters):\n\`\`\`\n${context.code}\n\`\`\`\n\n`;
      }
      
      if (context.explainer) {
        systemPrompt += `EXPLAINER AGENT RESULTS:\n`;
        systemPrompt += `- Overview: ${context.explainer.overview || 'N/A'}\n`;
        systemPrompt += `- Purpose: ${context.explainer.purpose || 'N/A'}\n`;
        if (context.explainer.keyIdentifiers && context.explainer.keyIdentifiers.length > 0) {
          systemPrompt += `- Key Identifiers: ${context.explainer.keyIdentifiers.join(', ')}\n`;
        }
        systemPrompt += `\n`;
      }
      
      if (context.bugHunter) {
        systemPrompt += `BUG HUNTER AGENT RESULTS:\n`;
        systemPrompt += `- Summary: ${context.bugHunter.summary || 'N/A'}\n`;
        systemPrompt += `- Findings: ${context.bugHunter.findingsCount} issue(s) found\n`;
        if (context.bugHunter.findings && context.bugHunter.findings.length > 0) {
          systemPrompt += `- Key Issues:\n`;
          context.bugHunter.findings.forEach((finding, idx) => {
            systemPrompt += `  ${idx + 1}. [${finding.severity || 'N/A'}] ${finding.title || 'N/A'}\n`;
            systemPrompt += `     Impact: ${finding.impact || 'N/A'}\n`;
          });
        }
        systemPrompt += `\n`;
      }
      
      if (context.complexity) {
        systemPrompt += `COMPLEXITY AGENT RESULTS:\n`;
        systemPrompt += `- Time Complexity: ${context.complexity.timeComplexity || 'N/A'}\n`;
        systemPrompt += `- Space Complexity: ${context.complexity.spaceComplexity || 'N/A'}\n`;
        if (context.complexity.timeReasoning) {
          systemPrompt += `- Reasoning: ${context.complexity.timeReasoning}\n`;
        }
        systemPrompt += `\n`;
      }
      
      if (context.debate) {
        systemPrompt += `DEBATE RESULTS:\n`;
        systemPrompt += `- Topic: ${context.debate.topic || 'N/A'}\n`;
        systemPrompt += `- Rounds: ${context.debate.roundsCount} debate rounds conducted\n`;
        if (context.debate.consensus) {
          systemPrompt += `- Consensus: ${context.debate.consensus.isProductionReady ? 'Production Ready' : 'Not Production Ready'}\n`;
          if (context.debate.consensus.rationale) {
            systemPrompt += `- Rationale: ${context.debate.consensus.rationale}\n`;
          }
        }
        systemPrompt += `\n`;
      }
      
      if (context.finalVerdict) {
        systemPrompt += `FINAL VERDICT:\n`;
        systemPrompt += `- Summary: ${context.finalVerdict.summary || 'N/A'}\n`;
        systemPrompt += `- Risk Level: ${context.finalVerdict.riskLevel || 'N/A'}\n`;
        if (context.finalVerdict.actionItems && context.finalVerdict.actionItems.length > 0) {
          systemPrompt += `- Priority Actions:\n`;
          context.finalVerdict.actionItems.forEach((item, idx) => {
            systemPrompt += `  ${item.priority || idx + 1}. ${item.action || 'N/A'}\n`;
          });
        }
        systemPrompt += `\n`;
      }
      
      systemPrompt += "IMPORTANT: When users ask questions about their code, use the analysis results above to provide specific, accurate answers. Reference actual findings, issues, complexities, and recommendations from the analysis. If the user asks about something not covered in the analysis, say so honestly.\n\n";
    } else {
      systemPrompt += "Note: The user hasn't run a code analysis yet. You can still help with general questions about Code Council, code analysis, or development.\n\n";
    }
    
    systemPrompt += "Always be helpful, concise, and reference specific details from the analysis when available.";
    
    // Build messages array
    const messages = [
      ...(history || []).map(h => ({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: h.content
      })),
      {
        role: "user",
        content: message,
      }
    ];
    
    // Try OpenAI first (don't force JSON for chat)
    let reply = await generateOpenAIResponse('gpt-4o-mini', messages, systemPrompt, false);
    
    // Stub fallback if no API key
    if (!reply) {
      console.log('[backend] Using stub response (no API key)');
      reply = `I understand you're asking: "${message}". 

To enable full AI responses, please add your OPENAI_API_KEY to the backend/.env file. 

For now, I can tell you that Code Council is a multi-agent code analysis system that uses specialized AI agents to analyze, explain, and improve code through collaborative intelligence.`;
    }
    
    console.log('[backend] Chat response generated successfully');
    
    return res.json({reply});
  } catch(error) {
    console.error('[backend] Chat error:', error);
    return res.status(500).json({
      error: "Failed to process chat request. Please try again."
    });
  }
}
