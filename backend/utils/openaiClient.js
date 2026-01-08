import OpenAI from 'openai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize OpenAI client with error handling
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('[backend] WARNING: OPENAI_API_KEY not found in .env file');
  console.warn('[backend] OpenAI features will use fallback or stubs');
}

export const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
}) : null;

export async function generateOpenAIResponse(modelName, messages, systemPrompt = null, forceJSON = false) {
  if (!openai) {
    return null;
  }

  try {
    const messageArray = systemPrompt 
      ? [{ role: 'system', content: systemPrompt }, ...messages]
      : messages;

    const completion = await openai.chat.completions.create({
      model: modelName,
      messages: messageArray,
      response_format: forceJSON ? { type: 'json_object' } : undefined
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('[backend] OpenAI API error:', error);
    return null;
  }
}
