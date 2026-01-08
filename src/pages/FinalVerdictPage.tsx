import { useState } from 'react';
import { AgentTabs } from '../components/AgentTabs';
import { useAnalysis } from '../contexts/AnalysisContext';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { SectionCard } from '../components/ui/SectionCard';
import { BulletList } from '../components/ui/BulletList';
import { CodeBlock } from '../components/ui/CodeBlock';

export function FinalVerdictPage() {
  const [activeAgentTab, setActiveAgentTab] = useState('refined');
  const { results, isLoading, error } = useAnalysis();
  const supervisor = results?.supervisor;

  const riskColors = {
    low: { color: '#6BCF7F', bg: 'rgba(107, 207, 127, 0.1)', border: 'rgba(107, 207, 127, 0.3)', icon: CheckCircle2 },
    medium: { color: '#FFD93D', bg: 'rgba(255, 217, 61, 0.1)', border: 'rgba(255, 217, 61, 0.3)', icon: AlertTriangle },
    high: { color: '#FF4D6D', bg: 'rgba(255, 77, 109, 0.1)', border: 'rgba(255, 77, 109, 0.3)', icon: AlertTriangle }
  };

  if (error) {
    return (
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-red-500/10 rounded-3xl border border-red-500/20" />
        <div className="relative z-10 p-6">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!supervisor && !isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
        <div className="relative z-10 p-6 text-center">
          <p className="text-white/60">No analysis available. Run code analysis first.</p>
        </div>
      </div>
    );
  }

  // Fallback for old format
  if (supervisor && 'final' in supervisor && typeof supervisor.final === 'string') {
    const oldSupervisor = supervisor as any;
    return (
      <div className="space-y-6">
        <SectionCard title="Final Verdict">
          <p className="text-white/80 whitespace-pre-wrap">{oldSupervisor.final}</p>
        </SectionCard>
        {oldSupervisor.actionItems && oldSupervisor.actionItems.length > 0 && (
          <SectionCard title="Action Items">
            <BulletList items={oldSupervisor.actionItems} />
          </SectionCard>
        )}
        <AgentTabs 
          activeTab={activeAgentTab} 
          onTabChange={setActiveAgentTab}
          isAnalyzing={isLoading}
        />
      </div>
    );
  }

  const riskConfig = riskColors[supervisor?.riskLevel || 'low'];
  const RiskIcon = riskConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Risk Level */}
      {supervisor && (
        <SectionCard title="Risk Assessment">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-xl"
              style={{ backgroundColor: riskConfig.bg }}
            >
              <RiskIcon className="w-6 h-6" style={{ color: riskConfig.color }} />
            </div>
            <div>
              <p 
                className="text-2xl font-bold uppercase"
                style={{ color: riskConfig.color }}
              >
                {supervisor.riskLevel}
              </p>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Overall risk level
              </p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Final Summary */}
      {supervisor?.finalSummary && (
        <SectionCard title="Summary" subtitle="Comprehensive analysis summary">
          <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
            {supervisor.finalSummary}
          </p>
        </SectionCard>
      )}

      {/* Action Items */}
      {supervisor?.actionItems && supervisor.actionItems.length > 0 && (
        <SectionCard title="Action Items" subtitle="Recommended next steps">
          <BulletList items={supervisor.actionItems} />
        </SectionCard>
      )}

      {/* Optimized Code */}
      {supervisor?.optimizedCode && (
        <SectionCard 
          title="Optimized Code" 
          subtitle="Improved version of your code"
        >
          <div className="space-y-4">
            <CodeBlock 
              code={supervisor.optimizedCode.code} 
              language={supervisor.optimizedCode.language || 'javascript'}
            />
            
            {supervisor.optimizedCode.whyBetter && supervisor.optimizedCode.whyBetter.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Why this is better:
                </h4>
                <BulletList items={supervisor.optimizedCode.whyBetter} />
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Agent Tabs */}
      <AgentTabs 
        activeTab={activeAgentTab} 
        onTabChange={setActiveAgentTab}
        isAnalyzing={isLoading}
      />
    </div>
  );
}
