import { createContext, useContext, useState, ReactNode } from 'react';

export interface AnalysisLog {
  ts: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

// New structured types matching backend schema
export interface ExplainerResult {
  title: string;
  summary: string;
  stepByStep: Array<{ step: number; text: string }>;
  keyConcepts: Array<{ name: string; explanation: string }>;
  edgeCases: string[];
  exampleWalkthrough: string;
}

export interface BugFinding {
  severity: 'low' | 'medium' | 'high';
  title: string;
  whyItMatters: string;
  whereInCode: string;
  fix: string;
}

export interface BugHunterResult {
  overallRisk: 'low' | 'medium' | 'high';
  bugCount: number;
  statusMessage: string;
  findings: BugFinding[];
  suggestions: string[];
  quickFixes: string[];
}

export interface ComplexityResult {
  time: string;
  space: string;
  dominantOperations: string[];
  notes: string[];
  improvements: string[];
}

export interface DebateRound {
  round: number;
  speaker: 'Explainer' | 'BugHunter' | 'Complexity';
  stance: 'claim' | 'rebuttal' | 'counter';
  text: string;
  evidence: string[];
}

export interface DebateResult {
  topic: string;
  rounds: DebateRound[];
  judgeSummary: {
    winner: 'Explainer' | 'BugHunter' | 'Complexity';
    reason: string;
  };
}

export interface OptimizedCode {
  language: string;
  code: string;
  whyBetter: string[];
}

export interface SupervisorResult {
  finalSummary: string;
  actionItems: string[];
  riskLevel: 'low' | 'medium' | 'high';
  optimizedCode: OptimizedCode;
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
  supervisor: SupervisorResult;
}

interface AnalysisContextType {
  traceId: string | null;
  results: AnalysisResults | null;
  logs: AnalysisLog[];
  isLoading: boolean;
  error: string | null;
  code: string;
  setCode: (code: string) => void;
  setAnalysis: (traceId: string, results: AnalysisResults, logs: AnalysisLog[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [traceId, setTraceId] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [logs, setLogs] = useState<AnalysisLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
    setTraceId(newTraceId);
    setResults(newResults);
    setLogs(newLogs);
    setError(null);
  };

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (loading) {
      setError(null);
    }
  };

  const clearAnalysis = () => {
    setTraceId(null);
    setResults(null);
    setLogs([]);
    setError(null);
    setIsLoading(false);
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
        setCode,
        setAnalysis,
        setLoading,
        setError,
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
