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
    // Try the requested model first
    let model;
    try {
      model = gemini.getGenerativeModel({ 
        model: modelName,
        generationConfig: {
          temperature: 0.1,
        }
      });
    } catch (modelError) {
      console.warn(`[backend] Model ${modelName} not available, trying fallback models...`);
      // Try common model names as fallback
      const fallbackModels = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
      let modelFound = false;
      
      for (const fallbackModel of fallbackModels) {
        if (fallbackModel === modelName) continue; // Skip if already tried
        try {
          model = gemini.getGenerativeModel({ 
            model: fallbackModel,
            generationConfig: { temperature: 0.1 }
          });
          console.log(`[backend] Using fallback model: ${fallbackModel}`);
          modelFound = true;
          break;
        } catch (e) {
          // Continue to next fallback
        }
      }
      
      if (!modelFound) {
        throw new Error(`No valid Gemini model found. Tried: ${modelName}, ${fallbackModels.join(', ')}`);
      }
    }
    
    let fullPrompt = prompt;
    if (systemPrompt) {
      fullPrompt = `${systemPrompt}\n\n${prompt}`;
    }

    // Ensure prompt explicitly requests JSON
    if (!fullPrompt.includes('Return ONLY valid JSON') && !fullPrompt.includes('Return JSON') && !fullPrompt.includes('<json>')) {
      fullPrompt = fullPrompt + '\n\nIMPORTANT: You MUST return ONLY valid JSON. Do not include any markdown code blocks, no ```json tags, just the raw JSON object.';
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Log first 200 chars for debugging
    console.log(`[backend] Gemini response (${text.length} chars): ${text.substring(0, 200)}...`);
    
    return text;
  } catch (error) {
    console.error('[backend] Gemini API error:', error);
    console.error('[backend] Gemini error details:', error.message);
    if (error.message) {
      console.error('[backend] Error message:', error.message);
    }
    if (error.stack) {
      console.error('[backend] Error stack:', error.stack.substring(0, 500));
    }
    return null;
  }
}

