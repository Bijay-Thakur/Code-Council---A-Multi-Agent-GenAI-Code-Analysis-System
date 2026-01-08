/**
 * @typedef {Object} ExplainerResult
 * @property {string} title
 * @property {string} summary
 * @property {Array<{step: number, text: string}>} stepByStep
 * @property {Array<{name: string, explanation: string}>} keyConcepts
 * @property {string[]} edgeCases
 * @property {string} exampleWalkthrough
 */

/**
 * @typedef {Object} BugFinding
 * @property {'low'|'medium'|'high'} severity
 * @property {string} title
 * @property {string} whyItMatters
 * @property {string} whereInCode
 * @property {string} fix
 */

/**
 * @typedef {Object} BugHunterResult
 * @property {'low'|'medium'|'high'} overallRisk
 * @property {BugFinding[]} findings
 * @property {string[]} quickFixes
 */

/**
 * @typedef {Object} ComplexityResult
 * @property {string} time
 * @property {string} space
 * @property {string[]} dominantOperations
 * @property {string[]} notes
 * @property {string[]} improvements
 */

/**
 * @typedef {Object} DebateRound
 * @property {number} round
 * @property {'Explainer'|'BugHunter'|'Complexity'} speaker
 * @property {'claim'|'rebuttal'|'counter'} stance
 * @property {string} text
 * @property {string[]} evidence
 */

/**
 * @typedef {Object} DebateResult
 * @property {string} topic
 * @property {DebateRound[]} rounds
 * @property {{winner: 'Explainer'|'BugHunter'|'Complexity', reason: string}} judgeSummary
 */

/**
 * @typedef {Object} OptimizedCode
 * @property {string} language
 * @property {string} code
 * @property {string[]} whyBetter
 */

/**
 * @typedef {Object} SupervisorResult
 * @property {string} finalSummary
 * @property {string[]} actionItems
 * @property {'low'|'medium'|'high'} riskLevel
 * @property {OptimizedCode} optimizedCode
 */

/**
 * @typedef {Object} OrchestratorResult
 * @property {string} plan
 * @property {string[]} routing
 */

/**
 * @typedef {Object} AnalysisResults
 * @property {OrchestratorResult} orchestrator
 * @property {ExplainerResult} explainer
 * @property {BugHunterResult} bugHunter
 * @property {ComplexityResult} complexity
 * @property {DebateResult} debate
 * @property {SupervisorResult} supervisor
 */

/**
 * @typedef {Object} AnalysisLog
 * @property {string} ts - ISO timestamp
 * @property {'info'|'warn'|'error'} level
 * @property {string} message
 */

/**
 * @typedef {Object} AnalysisResponse
 * @property {string} traceId
 * @property {AnalysisResults} results
 * @property {AnalysisLog[]} logs
 */

module.exports = {};
