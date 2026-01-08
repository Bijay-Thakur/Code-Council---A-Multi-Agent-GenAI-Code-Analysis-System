import { generateOpenAIResponse } from '../utils/openaiClient.js';

export async function chatController(req, res) {
  try {
    console.log('[backend] POST /api/chat - Received chat request');
    
    const {message, history} = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.log('[backend] Error: Message is required');
      return res.status(400).json({error: "Message is required and must be a non-empty string"});
    }
    
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
    
    const systemPrompt = "You are the Code Council assistant, a helpful AI that assists users with code analysis and development questions. Be friendly, professional, and concise. Help users understand code analysis results, answer questions about the multi-agent system, and provide coding guidance.";
    
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
