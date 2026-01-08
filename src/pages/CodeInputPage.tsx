import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CodeEditor } from '../components/CodeEditor';
import { AgentTabs } from '../components/AgentTabs';
import { AnalysisLoader } from '../components/AnalysisLoader';
import { useAnalysis } from '../contexts/AnalysisContext';
import { API_BASE_URL } from '../config/api';

export function CodeInputPage() {
  const [activeAgentTab, setActiveAgentTab] = useState('explainer');
  const { isLoading, setLoading, setAnalysis, setError, error, code, setCode } = useAnalysis();
  const navigate = useNavigate();

  const handleRunAnalysis = async (codeToAnalyze: string, language: string) => {
    if (!codeToAnalyze.trim()) {
      setError('Please enter some code to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[frontend] Sending analysis request...', { 
        url: `${API_BASE_URL}/api/analyze`,
        codeLength: codeToAnalyze.length,
        language 
      });
      
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToAnalyze,
          language: language,
          options: {
            debateRounds: 4
          }
        }),
      });

      console.log('[frontend] Response status:', response.status, response.statusText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { error: `Server returned ${response.status}: ${response.statusText}` };
        }
        console.error('[frontend] Error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[frontend] Analysis complete:', data.traceId);
      
      setAnalysis(data.traceId, data.results, data.logs);
      
      // Navigate to final verdict page
      navigate('/final');
    } catch (error) {
      console.error('[frontend] Analysis error:', error);
      setError(error instanceof Error ? error.message : 'Failed to analyze code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isLoading && <AnalysisLoader />}
      <div className="space-y-6">
        {error && (
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-2xl bg-red-500/10 rounded-3xl border border-red-500/20" />
            <div className="relative z-10 p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}
        <CodeEditor 
          isAnalyzing={isLoading} 
          onRunAnalysis={handleRunAnalysis}
          code={code}
          onCodeChange={setCode}
        />
        <AgentTabs 
          activeTab={activeAgentTab} 
          onTabChange={setActiveAgentTab}
          isAnalyzing={isLoading}
        />
      </div>
    </>
  );
}

