import { useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { AgentTabs } from '../components/AgentTabs';

export function CodeInputPage() {
  const [activeAgentTab, setActiveAgentTab] = useState('explainer');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="space-y-6">
      <CodeEditor 
        isAnalyzing={isAnalyzing} 
        onRunAnalysis={() => setIsAnalyzing(true)} 
      />
      <AgentTabs 
        activeTab={activeAgentTab} 
        onTabChange={setActiveAgentTab}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
}

