import { z } from 'zod';
import { safeParseJSON } from '../utils/jsonParse.js';

/**
 * Zod schemas for strict validation of agent outputs
 */

// Shared system prompt
export const SHARED_SYSTEM_PROMPT = "You are Code Council, a precise code analysis assistant. You MUST be specific and grounded in the provided code. Never use vague filler. Always reference concrete identifiers (function names, variables, loops, conditions). Output MUST be valid JSON matching the required schema. Do not include markdown headings. If unsure, state uncertainty inside the JSON fields.";

// Explainer Agent Schema - SOFT VALIDATION (all fields optional, has defaults)
// This allows partial responses to be accepted and merged with fallbacks
export const ExplainerSchema = z.object({
  overview: z.string().optional().default("Code analysis in progress"),
  purpose: z.string().optional().default("Analyzing code purpose"),
  keyIdentifiers: z.array(z.string()).optional().default([]), // New field from prompt
  inputs: z.array(z.object({
    name: z.string().optional().default("unknown"),
    typeGuess: z.string().optional().default("unknown"),
    notes: z.string().optional().default("")
  }).passthrough()).optional().default([]),
  outputs: z.array(z.object({
    name: z.string().optional().default("unknown"),
    typeGuess: z.string().optional().default("unknown"),
    notes: z.string().optional().default("")
  }).passthrough()).optional().default([]),
  blockByBlock: z.array(z.object({
    title: z.string().optional().default("Code block"),
    whatHappens: z.string().optional().default("Processing"),
    whyItMatters: z.string().optional().default(""),
    identifiers: z.array(z.string()).optional().default([])
  }).passthrough()).optional().default([]),
  exampleTrace: z.array(z.object({
    step: z.number().optional().default(1),
    state: z.string().optional().default(""),
    explanation: z.string().optional().default("")
  }).passthrough()).optional().default([]),
  edgeCases: z.array(z.string()).optional().default([]), // Simplified - can be array of strings or objects
  improvements: z.array(z.union([
    z.string(),
    z.object({
      title: z.string().optional(),
      change: z.string().optional(),
      benefit: z.string().optional()
    }).passthrough()
  ])).optional().default([])
}).passthrough(); // Allow extra fields

// Bug Hunter Schema
export const BugHunterSchema = z.object({
  summary: z.string().describe("Overall summary of findings"),
  findings: z.array(z.object({
    severity: z.enum(['low', 'medium', 'high', 'critical']).describe("Severity level"),
    title: z.string().describe("Issue title"),
    evidence: z.string().describe("Evidence from code (line numbers, code snippets)"),
    impact: z.string().describe("Impact if not fixed"),
    fix: z.string().describe("How to fix this issue")
  })).default([]).describe("List of bug findings"),
  quickWins: z.array(z.object({
    title: z.string().describe("Quick fix title"),
    diffHint: z.string().describe("Hint about what to change (not actual diff)")
  })).default([]).describe("Quick wins for easy fixes")
});

// Complexity Schema
export const ComplexitySchema = z.object({
  time: z.object({
    bigO: z.string().describe("Big O notation (e.g., 'O(n)', 'O(n log n)')"),
    reasoning: z.string().describe("Reasoning for this complexity")
  }).describe("Time complexity analysis"),
  space: z.object({
    bigO: z.string().describe("Big O notation (e.g., 'O(1)', 'O(n)')"),
    reasoning: z.string().describe("Reasoning for this complexity")
  }).describe("Space complexity analysis"),
  hotspots: z.array(z.object({
    where: z.string().describe("Where the hotspot is (function name, line reference)"),
    why: z.string().describe("Why this is a hotspot")
  })).default([]).describe("Performance hotspots"),
  optimizations: z.array(z.object({
    title: z.string().describe("Optimization title"),
    whatToChange: z.string().describe("What to change in the code"),
    expectedImpact: z.string().describe("Expected performance impact")
  })).default([]).describe("Suggested optimizations")
});

// Debate Round Schema - SOFT VALIDATION (all fields optional with defaults)
export const DebateRoundSchema = z.object({
  round: z.number().optional().default(1),
  speaker: z.string().optional().default("Explainer"), // Allow any string, validate later
  type: z.string().optional().default("claim"), // Allow any string, validate later
  claim: z.string().optional().default("Debate round in progress"),
  evidence: z.array(z.string()).optional().default([]),
  rebuttals: z.array(z.string()).optional().default([]),
  concessions: z.array(z.string()).optional().default([]),
  proposedFixes: z.array(z.string()).optional().default([]),
  // Backward compatibility
  text: z.string().optional(),
  stance: z.string().optional()
}).passthrough();

// Debate Schema - SOFT VALIDATION
export const DebateSchema = z.object({
  topic: z.string().optional().default("Is this code production-ready? What should be improved first?"),
  rounds: z.array(DebateRoundSchema).optional().default([]),
  consensus: z.object({
    isProductionReady: z.boolean().optional().default(false),
    topPriorities: z.union([
      z.array(z.string()), // Simple array of strings
      z.array(z.object({
        priority: z.number().optional(),
        item: z.string().optional(),
        why: z.string().optional()
      }).passthrough())
    ]).optional().default([]),
    rationale: z.string().optional().default("Consensus pending")
  }).passthrough().optional().default({
    isProductionReady: false,
    topPriorities: [],
    rationale: "Consensus pending"
  })
}).passthrough(); // Allow extra fields

// Final Verdict Schema
export const FinalVerdictSchema = z.object({
  summary: z.string().describe("Executive summary"),
  riskLevel: z.enum(['low', 'medium', 'high']).describe("Overall risk level"),
  prioritizedActions: z.array(z.object({
    priority: z.number().describe("Priority number (1 is highest)"),
    action: z.string().describe("Action to take"),
    why: z.string().describe("Why this action is important")
  })).default([]).describe("Prioritized action items"),
  optimizedCode: z.object({
    language: z.string().describe("Programming language"),
    code: z.string().describe("Complete optimized code")
  }).describe("Optimized version of the code"),
  notes: z.array(z.string()).default([]).describe("Additional notes")
});

// Fallback schemas for when validation fails - with safe defaults
export const createFallbackExplainer = () => ({
  overview: "Code analysis is being processed. Please wait or check system logs.",
  purpose: "Analyzing code structure and functionality",
  keyIdentifiers: [],
  inputs: [],
  outputs: [],
  blockByBlock: [],
  exampleTrace: [],
  edgeCases: [],
  improvements: []
});

export const createFallbackBugHunter = () => ({
  summary: "Unable to parse bug hunter response",
  findings: [],
  quickWins: []
});

export const createFallbackComplexity = () => ({
  time: { bigO: "O(?)", reasoning: "Unable to analyze" },
  space: { bigO: "O(?)", reasoning: "Unable to analyze" },
  hotspots: [],
  optimizations: []
});

export const createFallbackDebate = () => ({
  topic: "Is this code production-ready? What should be improved first?",
  rounds: [
    {
      round: 1,
      speaker: "Explainer",
      type: "claim",
      claim: "Debate analysis is being processed. Initial analysis suggests reviewing the code structure first.",
      evidence: [],
      rebuttals: [],
      concessions: [],
      proposedFixes: []
    }
  ],
  consensus: {
    isProductionReady: false,
    topPriorities: ["Review code structure", "Check for potential bugs", "Assess performance"],
    rationale: "Initial debate analysis is in progress. Full consensus pending."
  }
});

export const createFallbackFinalVerdict = (language = 'javascript', code = '') => ({
  summary: "Unable to generate final verdict",
  riskLevel: 'medium',
  prioritizedActions: [],
  optimizedCode: { language, code },
  notes: ["Analysis incomplete"]
});

/**
 * Validate and parse agent response with zod - SOFT VALIDATION
 * Uses tolerant parser, keeps partial data, includes rawText for debugging
 */
export function validateAgentResponse(response, schema, fallbackFn) {
  const isDev = process.env.NODE_ENV !== 'production';
  
  try {
    if (!response || typeof response !== 'string') {
      return { valid: false, data: fallbackFn(), errors: ['Invalid response type'], rawText: null };
    }

    // Use tolerant parser (tries multiple extraction methods)
    const parseResult = safeParseJSON(response);
    
    // Log raw output in dev mode if parsing failed
    if (!parseResult.success && isDev && parseResult.rawText) {
      console.log('[Validation] Raw LLM output (first 2000 chars):', parseResult.rawText);
      console.log('[Validation] Parse error:', parseResult.error);
    }
    
    if (!parseResult.success || !parseResult.data) {
      const fallback = fallbackFn();
      // Include rawText in debug field if in dev mode
      if (isDev && parseResult.rawText) {
        fallback._debug = { rawText: parseResult.rawText.substring(0, 1000), parseError: parseResult.error };
      }
      console.warn('[Validation] Failed to parse JSON, using fallback');
      return { valid: false, data: fallback, errors: [parseResult.error || 'Failed to parse JSON'], rawText: parseResult.rawText };
    }

    const data = parseResult.data;

    // Try strict validation first
    const strictResult = schema.safeParse(data);
    if (strictResult.success) {
      console.log('[Validation] Strict validation succeeded');
      return { valid: true, data: strictResult.data, errors: [] };
    }

    // Try passthrough to allow extra fields
    const passthroughSchema = schema.passthrough();
    const passthroughResult = passthroughSchema.safeParse(data);
    
    if (passthroughResult.success) {
      const fallback = fallbackFn();
      const merged = { ...fallback, ...passthroughResult.data };
      
      // Normalize arrays - ensure they're arrays
      const arrayFields = ['inputs', 'outputs', 'blockByBlock', 'exampleTrace', 'edgeCases', 'improvements', 
                          'findings', 'quickWins', 'hotspots', 'optimizations', 'prioritizedActions', 'notes'];
      arrayFields.forEach(field => {
        if (fallback[field] !== undefined) {
          merged[field] = Array.isArray(merged[field]) ? merged[field] : (Array.isArray(data[field]) ? data[field] : []);
        }
      });
      
      // Extract required fields from data, prioritizing data over fallback
      if (data.overview && typeof data.overview === 'string' && data.overview !== fallback.overview) {
        merged.overview = data.overview;
      }
      if (data.purpose && typeof data.purpose === 'string' && data.purpose !== fallback.purpose) {
        merged.purpose = data.purpose;
      }
      if (data.summary && typeof data.summary === 'string' && data.summary !== fallback.summary) {
        merged.summary = data.summary;
      }
      
      // Try to extract from old format fields for backward compatibility
      if ((!merged.overview || merged.overview === fallback.overview) && data.title) {
        merged.overview = data.title;
      }
      if ((!merged.purpose || merged.purpose === fallback.purpose) && data.whatItDoes) {
        merged.purpose = data.whatItDoes;
      }
      
      console.log('[Validation] Passthrough validation succeeded, using merged data');
      return { valid: true, data: merged, errors: [] };
    }

    // Last resort: manual merge prioritizing actual data
    console.warn('[Validation] All validation failed, attempting manual merge. Errors:', passthroughResult.error?.errors?.slice(0, 3).map(e => `${e.path.join('.')}: ${e.message}`).join(', ') || 'Unknown error');
    
    const fallback = fallbackFn();
    const merged = { ...fallback };
    
    // Prioritize actual data from LLM response
    if (typeof data === 'object' && data !== null) {
      // Copy ALL fields from data first (prioritize LLM response)
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (Array.isArray(data[key])) {
            merged[key] = data[key];
          } else if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
            merged[key] = { ...(merged[key] || {}), ...data[key] };
          } else {
            merged[key] = data[key];
          }
        }
      });
      
      // Ensure arrays are arrays and required fields exist
      Object.keys(fallback).forEach(key => {
        if (Array.isArray(fallback[key]) && !Array.isArray(merged[key])) {
          merged[key] = Array.isArray(data[key]) ? data[key] : fallback[key];
        }
        if (merged[key] === undefined || merged[key] === null) {
          merged[key] = fallback[key];
        }
      });
    }
    
    // Check if we got any real data (not just fallback)
    const hasRealData = Object.keys(data || {}).length > 0 && 
                       (data.overview || data.purpose || data.summary || data.title || 
                        data.whatItDoes || (Array.isArray(data.blockByBlock) && data.blockByBlock.length > 0));
    
    // Even if no real data detected, return merged (might have some useful structure)
    console.warn('[Validation] No clear real data detected, but returning merged structure anyway');
    return { 
      valid: true, // Always return something, even if partial
      data: merged, 
      errors: passthroughResult.error?.errors?.slice(0, 5).map(e => `${e.path.join('.')}: ${e.message}`) || ['Partial validation'],
      rawText: parseResult.rawText
    };
  } catch (error) {
    console.error('[Validation] Error in validateAgentResponse:', error);
    const fallback = fallbackFn();
    if (isDev && response) {
      fallback._debug = { error: error.message, rawTextPreview: response.substring(0, 500) };
    }
    return { valid: false, data: fallback, errors: [error.message], rawText: response?.substring(0, 2000) };
  }
}

// Re-export for convenience
export { safeParseJSON };
