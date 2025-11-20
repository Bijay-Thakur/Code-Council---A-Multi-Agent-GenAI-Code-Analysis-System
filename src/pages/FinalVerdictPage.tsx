import { useState } from 'react';
import { AgentTabs } from '../components/AgentTabs';

export function FinalVerdictPage() {
  const [activeAgentTab, setActiveAgentTab] = useState('refined');
  const [isAnalyzing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
        <div className="relative z-10 p-6">
          <h2 className="text-2xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
            Final Verdict
          </h2>
          <p className="text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
            Merged analysis from all agents
          </p>
        </div>
      </div>
      <AgentTabs 
        activeTab={activeAgentTab} 
        onTabChange={setActiveAgentTab}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
}

