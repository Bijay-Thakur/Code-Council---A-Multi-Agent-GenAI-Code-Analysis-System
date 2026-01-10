import { createContext, useContext, useState, ReactNode } from 'react';

export interface AnalysisLog {
  ts: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

// Updated types matching new backend schemas

export interface ExplainerResult {
  overview: string;
  purpose: string;
  keyIdentifiers?: string[]; // New field for key identifiers
  inputs: Array<{ name: string; typeGuess: string; notes: string }>;
  outputs: Array<{ name: string; typeGuess: string; notes: string }>;
  blockByBlock: Array<{
    title: string;
    whatHappens: string;
    whyItMatters: string;
    identifiers: string[];
  }>;
  exampleTrace: Array<{
    step: number;
    state: string;
    explanation: string;
  }>;
  edgeCases: Array<{
    case: string;
    impact: string;
    suggestion: string;
  }> | string[]; // Can be string array or object array
  improvements: Array<{
    title: string;
    change: string;
    benefit: string;
  }> | string[]; // Can be string array or object array
  // Backward compatibility fields (if old format exists)
  title?: string;
  summary?: string;
  whatItDoes?: string;
  inputOutput?: { input: string; output: string };
  stepByStep?: Array<{ step: number; text: string }>;
  keyConcepts?: Array<{ name: string; explanation: string }>;
  exampleWalkthrough?: string;
}

export interface BugFinding {
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  evidence: string;
  impact: string;
  fix: string;
  // Backward compatibility
  whyItMatters?: string;
  whereInCode?: string;
}

export interface BugHunterResult {
  summary: string;
  findings: BugFinding[];
  quickWins: Array<{
    title: string;
    diffHint: string;
  }>;
  // Backward compatibility
  overallRisk?: 'low' | 'medium' | 'high';
  bugCount?: number;
  statusMessage?: string;
  suggestions?: string[];
  quickFixes?: string[];
}

export interface ComplexityResult {
  time: {
    bigO: string;
    reasoning: string;
  };
  space: {
    bigO: string;
    reasoning: string;
  };
  hotspots: Array<{
    where: string;
    why: string;
  }>;
  optimizations: Array<{
    title: string;
    whatToChange: string;
    expectedImpact: string;
  }>;
  // Backward compatibility
  dominantOperations?: string[];
  notes?: string[];
  improvements?: string[];
}

export interface DebateRound {
  round: number;
  speaker: 'Explainer' | 'BugHunter' | 'Complexity' | 'Judge';
  type: 'claim' | 'rebuttal' | 'counter' | 'response' | 'verdict';
  claim: string;
  evidence: string[];
  rebuttals: string[];
  concessions: string[];
  proposedFixes: string[];
  // Backward compatibility
  stance?: 'claim' | 'rebuttal' | 'counter';
  text?: string;
}

export interface DebateConsensus {
  isProductionReady: boolean;
  topPriorities: Array<{
    priority: number;
    item: string;
    why: string;
  }>;
  rationale: string;
}

export interface DebateResult {
  topic: string;
  rounds: DebateRound[];
  consensus: DebateConsensus;
  // Backward compatibility
  judgeSummary?: {
    winner: 'Explainer' | 'BugHunter' | 'Complexity';
    reason: string;
  };
}

export interface OptimizedCode {
  language: string;
  code: string;
  // Backward compatibility
  whyBetter?: string[];
}

export interface FinalVerdictResult {
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  prioritizedActions: Array<{
    priority: number;
    action: string;
    why: string;
  }>;
  optimizedCode: OptimizedCode;
  notes: string[];
  // Backward compatibility
  finalSummary?: string;
  actionItems?: string[];
}

export interface OrchestratorResult {
  plan: string;
  routing: string[];
}

export interface AnalysisResults {
  orchestrator: OrchestratorResult;
  explainer: ExplainerResult;
  bugHunter: BugHunterResult;
  complexity: ComplexityResult;
  debate: DebateResult;
  supervisor?: FinalVerdictResult;  // Backward compatibility
  finalVerdict?: FinalVerdictResult;  // New name
}

interface AnalysisContextType {
  traceId: string | null;
  results: AnalysisResults | null;
  logs: AnalysisLog[];
  isLoading: boolean;
  error: string | null;
  code: string;
  progress: number; // 0-100
  progressMessage: string;
  progressStage: string;
  setCode: (code: string) => void;
  setAnalysis: (traceId: string, results: AnalysisResults, logs: AnalysisLog[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: number | null | undefined, message: string, stage: string) => void;
  addDebateRound: (round: DebateRound) => void;
  setDebateConsensus: (consensus: DebateConsensus) => void;
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [traceId, setTraceId] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [logs, setLogs] = useState<AnalysisLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgressState] = useState<number>(0);
  const [progressMessage, setProgressMessage] = useState<string>('Starting analysis...');
  const [progressStage, setProgressStage] = useState<string>('initializing');
  
  // Persist code in localStorage
  const [code, setCodeState] = useState<string>(() => {
    const saved = localStorage.getItem('codeCouncil_code');
    return saved || '';
  });
  
  const setCode = (newCode: string) => {
    setCodeState(newCode);
    localStorage.setItem('codeCouncil_code', newCode);
  };
  
  const setAnalysis = (newTraceId: string, newResults: AnalysisResults, newLogs: AnalysisLog[]) => {
    // Normalize results: use finalVerdict if available, fall back to supervisor
    const normalizedResults = {
      ...newResults,
      finalVerdict: newResults.finalVerdict || newResults.supervisor,
      supervisor: newResults.supervisor || newResults.finalVerdict
    };
    
    setTraceId(newTraceId);
    setResults(normalizedResults as AnalysisResults);
    setLogs(newLogs);
    setError(null);
    setProgressState(100);
    setProgressMessage('Analysis complete!');
  };
  
  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
      setProgressState(0);
      setProgressMessage('Starting analysis...');
      setProgressStage('initializing');
    } else {
      setProgressState(100);
    }
  };
  
  const setProgress = (newProgress: number | null | undefined, message: string, stage: string) => {
    // Only update progress if it's a valid number, otherwise keep current progress
    if (newProgress !== null && newProgress !== undefined && !isNaN(newProgress)) {
      setProgressState(Math.max(0, Math.min(100, newProgress))); // Clamp between 0-100
    }
    if (message) {
      setProgressMessage(message);
    }
    if (stage) {
      setProgressStage(stage);
    }
  };
  
  const addDebateRound = (round: DebateRound) => {
    setResults(prev => {
      if (!prev) {
        // Initialize debate structure if no results yet
        return {
          orchestrator: { plan: '', routing: [] },
          explainer: { overview: '', purpose: '', inputs: [], outputs: [], blockByBlock: [], exampleTrace: [], edgeCases: [], improvements: [] },
          bugHunter: { summary: '', findings: [], quickWins: [] },
          complexity: { time: { bigO: '', reasoning: '' }, space: { bigO: '', reasoning: '' }, hotspots: [], optimizations: [] },
          debate: {
            topic: "Is this code production-ready? What should be improved first?",
            rounds: [round],
            consensus: { isProductionReady: false, topPriorities: [], rationale: '' }
          }
        };
      }
      
      // Add round to existing debate
      const currentDebate = prev.debate || {
        topic: "Is this code production-ready? What should be improved first?",
        rounds: [],
        consensus: { isProductionReady: false, topPriorities: [], rationale: '' }
      };
      
      // Check if round already exists (avoid duplicates)
      const roundExists = currentDebate.rounds.some(r => r.round === round.round && r.speaker === round.speaker);
      if (roundExists) {
        return prev; // Don't duplicate
      }
      
      return {
        ...prev,
        debate: {
          ...currentDebate,
          rounds: [...currentDebate.rounds, round].sort((a, b) => a.round - b.round)
        }
      };
    });
  };
  
  const setDebateConsensus = (consensus: DebateConsensus) => {
    setResults(prev => {
      if (!prev) return null;
      const currentDebate = prev.debate || {
        topic: "Is this code production-ready? What should be improved first?",
        rounds: [],
        consensus: { isProductionReady: false, topPriorities: [], rationale: '' }
      };
      return {
        ...prev,
        debate: {
          ...currentDebate,
          consensus
        }
      };
    });
  };
  
  const clearAnalysis = () => {
    setTraceId(null);
    setResults(null);
    setLogs([]);
    setError(null);
    setIsLoading(false);
    setProgressState(0);
    setProgressMessage('Starting analysis...');
    setProgressStage('initializing');
  };
  
  return (
    <AnalysisContext.Provider
      value={{
        traceId,
        results,
        logs,
        isLoading,
        error,
        code,
        progress,
        progressMessage,
        progressStage,
        setCode,
        setAnalysis,
        setLoading,
        setError,
        setProgress,
        addDebateRound,
        setDebateConsensus,
        clearAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
