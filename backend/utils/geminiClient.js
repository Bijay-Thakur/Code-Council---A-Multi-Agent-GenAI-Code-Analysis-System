import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '../.env') });

// Initialize Gemini client with error handling
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[backend] WARNING: GEMINI_API_KEY not found in .env file');
  console.warn('[backend] Gemini features will use fallback or stubs');
}

export const gemini = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function generateGeminiResponse(modelName, prompt, systemPrompt = null) {
  if (!gemini) {
    return null;
  }

  try {
    const model = gemini.getGenerativeModel({ model: modelName });
    
    let fullPrompt = prompt;
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\n${prompt}`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('[backend] Gemini API error:', error);
    return null;
  }
}

