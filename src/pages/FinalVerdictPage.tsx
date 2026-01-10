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
  
  // Handle both supervisor and finalVerdict for backward compatibility
  const finalVerdict = results?.finalVerdict || results?.supervisor;

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

  if (!finalVerdict && !isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
        <div className="relative z-10 p-6 text-center">
          <p className="text-white/60">No analysis available. Run code analysis first.</p>
        </div>
      </div>
    );
  }

  // Fallback for very old format
  if (finalVerdict && 'final' in finalVerdict && typeof finalVerdict.final === 'string') {
    const oldVerdict = finalVerdict as any;
    return (
      <div className="space-y-6">
        <SectionCard title="Final Verdict">
          <p className="text-white/80 whitespace-pre-wrap">{oldVerdict.final}</p>
        </SectionCard>
        {oldVerdict.actionItems && oldVerdict.actionItems.length > 0 && (
          <SectionCard title="Action Items">
            <BulletList items={oldVerdict.actionItems} />
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

  // Check if new format (has summary and prioritizedActions)
  const isNewFormat = finalVerdict && 'summary' in finalVerdict && 'prioritizedActions' in finalVerdict;
  const riskConfig = riskColors[finalVerdict?.riskLevel || 'low'];
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
      {finalVerdict && (
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
                {finalVerdict.riskLevel || 'low'}
              </p>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Overall risk level
              </p>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Summary (New Format) or Final Summary (Old Format) */}
      {finalVerdict && (finalVerdict.summary || finalVerdict.finalSummary) && (
        <SectionCard 
          title="Summary" 
          subtitle={isNewFormat ? "Executive summary" : "Comprehensive analysis summary"}
        >
          <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
            {finalVerdict.summary || finalVerdict.finalSummary}
          </p>
        </SectionCard>
      )}

      {/* Prioritized Actions (New Format) */}
      {isNewFormat && finalVerdict.prioritizedActions && finalVerdict.prioritizedActions.length > 0 && (
        <SectionCard title="Prioritized Action Items" subtitle="Recommended actions in order of priority">
          <div className="space-y-3">
            {finalVerdict.prioritizedActions
              .sort((a, b) => a.priority - b.priority)
              .map((action, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className="absolute inset-0 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10" />
                  <div className="relative z-10 p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#4DFFFF]/20 to-[#9A4DFF]/20 flex items-center justify-center text-white font-bold">
                      {action.priority}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {action.action}
                      </h4>
                      <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <span className="font-semibold">Why:</span> {action.why}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </SectionCard>
      )}

      {/* Action Items (Backward Compatibility) */}
      {!isNewFormat && finalVerdict.actionItems && finalVerdict.actionItems.length > 0 && (
        <SectionCard title="Action Items" subtitle="Recommended next steps">
          <BulletList items={finalVerdict.actionItems} />
        </SectionCard>
      )}

      {/* Notes (New Format) */}
      {isNewFormat && finalVerdict.notes && finalVerdict.notes.length > 0 && (
        <SectionCard title="Additional Notes" subtitle="Important observations">
          <BulletList items={finalVerdict.notes} />
        </SectionCard>
      )}

      {/* Optimized Code */}
      {finalVerdict?.optimizedCode && (
        <SectionCard 
          title="Optimized Code" 
          subtitle="Improved version of your code"
        >
          <div className="space-y-4">
            <CodeBlock 
              code={finalVerdict.optimizedCode.code} 
              language={finalVerdict.optimizedCode.language || 'javascript'}
            />
            
            {/* Why Better (Backward Compatibility) */}
            {finalVerdict.optimizedCode.whyBetter && finalVerdict.optimizedCode.whyBetter.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Why this is better:
                </h4>
                <BulletList items={finalVerdict.optimizedCode.whyBetter} />
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
