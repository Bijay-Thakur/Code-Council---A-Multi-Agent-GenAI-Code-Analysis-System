/**
 * Safely extract and parse JSON from LLM responses
 * Tolerant parser that tries multiple methods including balanced brace extraction
 */
export function safeParseJSON(response) {
  if (!response || typeof response !== 'string') {
    return { success: false, data: null, error: 'Invalid response type', rawText: response };
  }

  const trimmed = response.trim();

  // Method 1: Try direct parse first
  try {
    const parsed = JSON.parse(trimmed);
    return { success: true, data: parsed, error: null, rawText: null };
  } catch (e) {
    // Continue to extraction methods
  }

  // Method 2: Try extracting from <json>...</json> tags (new format)
  const jsonTagMatch = trimmed.match(/<json>\s*([\s\S]*?)\s*<\/json>/i);
  if (jsonTagMatch) {
    try {
      const parsed = JSON.parse(jsonTagMatch[1].trim());
      return { success: true, data: parsed, error: null, rawText: null };
    } catch (e) {
      // Continue
    }
  }

  // Method 3: Try extracting from markdown code blocks (```json ... ``` or ``` ... ```)
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      return { success: true, data: parsed, error: null, rawText: null };
    } catch (e) {
      // Continue
    }
  }

  // Method 4: Extract first balanced JSON object using brace matching
  const balancedObject = extractBalancedJSONObject(trimmed);
  if (balancedObject) {
    try {
      const parsed = JSON.parse(balancedObject);
      return { success: true, data: parsed, error: null, rawText: null };
    } catch (e) {
      // Continue
    }
  }

  // Method 5: Try finding first {...} pattern (simple match, might be unbalanced)
  const jsonObjectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    try {
      const parsed = JSON.parse(jsonObjectMatch[0]);
      return { success: true, data: parsed, error: null, rawText: null };
    } catch (e) {
      // Continue
    }
  }

  // Method 6: Try finding first JSON array
  const balancedArray = extractBalancedJSONArray(trimmed);
  if (balancedArray) {
    try {
      const parsed = JSON.parse(balancedArray);
      return { success: true, data: parsed, error: null, rawText: null };
    } catch (e) {
      // Continue
    }
  }

  // All methods failed - return failure with raw text for debugging
  return { 
    success: false, 
    data: null, 
    error: 'Could not parse JSON from response',
    rawText: trimmed.substring(0, 2000) // Limit raw text length for logging
  };
}

/**
 * Extract first balanced JSON object from text by matching braces
 */
function extractBalancedJSONObject(text) {
  const startIndex = text.indexOf('{');
  if (startIndex === -1) return null;

  let braceCount = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '{') {
        braceCount++;
      } else if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          return text.substring(startIndex, i + 1);
        }
      }
    }
  }

  return null; // Unbalanced braces
}

/**
 * Extract first balanced JSON array from text by matching brackets
 */
function extractBalancedJSONArray(text) {
  const startIndex = text.indexOf('[');
  if (startIndex === -1) return null;

  let bracketCount = 0;
  let inString = false;
  let escapeNext = false;

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === '\\') {
      escapeNext = true;
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          return text.substring(startIndex, i + 1);
        }
      }
    }
  }

  return null; // Unbalanced brackets
}

/**
 * Legacy function for backward compatibility
 */
export function extractJSON(response) {
  const result = safeParseJSON(response);
  return result.success ? result.data : null;
}
