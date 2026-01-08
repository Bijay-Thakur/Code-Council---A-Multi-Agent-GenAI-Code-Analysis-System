import { useAnalysis } from '../contexts/AnalysisContext';
import { SectionCard } from '../components/ui/SectionCard';
import { FindingsList } from '../components/ui/FindingsList';
import { BulletList } from '../components/ui/BulletList';
import { motion } from 'framer-motion';

export function BugHunterAgentPage() {
  const { results, isLoading } = useAnalysis();
  const bugHunter = results?.bugHunter;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Analyzing code...</p>
      </div>
    );
  }

  if (!bugHunter) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No analysis available. Run code analysis first.</p>
      </div>
    );
  }

  // Fallback for old format (backward compatibility)
  if ('text' in bugHunter && typeof bugHunter.text === 'string') {
    return (
      <div className="space-y-6">
        <SectionCard title="Bug Analysis">
          <p className="text-white/80 whitespace-pre-wrap">{bugHunter.text}</p>
        </SectionCard>
      </div>
    );
  }

  const riskColors = {
    low: { color: '#6BCF7F', bg: 'rgba(107, 207, 127, 0.1)', border: 'rgba(107, 207, 127, 0.3)' },
    medium: { color: '#FFD93D', bg: 'rgba(255, 217, 61, 0.1)', border: 'rgba(255, 217, 61, 0.3)' },
    high: { color: '#FF4D6D', bg: 'rgba(255, 77, 109, 0.1)', border: 'rgba(255, 77, 109, 0.3)' }
  };

  const riskConfig = riskColors[bugHunter.overallRisk] || riskColors.low;

  const bugCount = bugHunter.bugCount ?? (bugHunter.findings?.length || 0);
  const statusMessage = bugHunter.statusMessage || (bugCount === 0 ? 'Well done! No bugs found.' : `${bugCount} bug(s) found that need attention.`);

  return (
    <div className="space-y-6">
      {/* Status Message */}
      <SectionCard title="Bug Analysis Status">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`px-6 py-4 rounded-xl border ${
              bugCount === 0 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-red-500/10 border-red-500/30'
            }`}
          >
            <div className="text-center">
              <p className={`text-3xl font-bold ${bugCount === 0 ? 'text-green-400' : 'text-red-400'}`}>
                {bugCount}
              </p>
              <p className="text-white/60 text-sm mt-1">Bug{bugCount !== 1 ? 's' : ''} Found</p>
            </div>
          </motion.div>
          <div className="flex-1">
            <p className={`text-lg font-semibold ${
              bugCount === 0 ? 'text-green-400' : 'text-white'
            }`} style={{ fontFamily: 'Inter, sans-serif' }}>
              {statusMessage}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Overall Risk */}
      <SectionCard title="Overall Risk Assessment">
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-6 py-3 rounded-xl border"
            style={{
              backgroundColor: riskConfig.bg,
              borderColor: riskConfig.border
            }}
          >
            <span 
              className="text-lg font-semibold uppercase"
              style={{ color: riskConfig.color }}
            >
              {bugHunter.overallRisk}
            </span>
          </motion.div>
          <p className="text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
            Overall risk level for this codebase
          </p>
        </div>
      </SectionCard>

      {/* Findings */}
      {bugHunter.findings && bugHunter.findings.length > 0 && (
        <SectionCard title="Findings" subtitle={`${bugHunter.findings.length} issue(s) found`}>
          <FindingsList findings={bugHunter.findings} />
        </SectionCard>
      )}

      {/* Suggestions */}
      {bugHunter.suggestions && bugHunter.suggestions.length > 0 && (
        <SectionCard title="Suggestions" subtitle="General improvement recommendations">
          <BulletList items={bugHunter.suggestions} />
        </SectionCard>
      )}

      {/* Quick Fixes */}
      {bugHunter.quickFixes && bugHunter.quickFixes.length > 0 && (
        <SectionCard title="Quick Fixes" subtitle="Recommended immediate actions">
          <BulletList items={bugHunter.quickFixes} />
        </SectionCard>
      )}
    </div>
  );
}
