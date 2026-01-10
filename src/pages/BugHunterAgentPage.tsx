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

  // Check if new format (has summary field)
  const isNewFormat = 'summary' in bugHunter && typeof bugHunter.summary === 'string';
  const bugCount = bugHunter.findings?.length || 0;

  // Risk colors for backward compatibility
  const riskColors = {
    low: { color: '#6BCF7F', bg: 'rgba(107, 207, 127, 0.1)', border: 'rgba(107, 207, 127, 0.3)' },
    medium: { color: '#FFD93D', bg: 'rgba(255, 217, 61, 0.1)', border: 'rgba(255, 217, 61, 0.3)' },
    high: { color: '#FF4D6D', bg: 'rgba(255, 77, 109, 0.1)', border: 'rgba(255, 77, 109, 0.3)' }
  };

  // Calculate overall risk from findings severity
  const getOverallRisk = () => {
    if (!bugHunter.findings || bugHunter.findings.length === 0) return 'low';
    const severities = bugHunter.findings.map(f => f.severity);
    if (severities.includes('critical') || severities.includes('high')) return 'high';
    if (severities.includes('medium')) return 'medium';
    return 'low';
  };

  const overallRisk = bugHunter.overallRisk || getOverallRisk();
  const riskConfig = riskColors[overallRisk as keyof typeof riskColors] || riskColors.low;

  if (isNewFormat) {
    return (
      <div className="space-y-6">
        {/* Summary */}
        <SectionCard title="Bug Analysis Summary" subtitle={bugHunter.summary}>
          <div className="flex items-center gap-4 mt-4">
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
                <p className="text-white/60 text-sm mt-1">Finding{bugCount !== 1 ? 's' : ''}</p>
              </div>
            </motion.div>
            <div className="px-6 py-3 rounded-xl border" style={{
              backgroundColor: riskConfig.bg,
              borderColor: riskConfig.border
            }}>
              <span className="text-lg font-semibold uppercase" style={{ color: riskConfig.color }}>
                {overallRisk} Risk
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Findings */}
        {bugHunter.findings && bugHunter.findings.length > 0 && (
          <SectionCard title="Findings" subtitle={`${bugHunter.findings.length} issue(s) found`}>
            <FindingsList findings={bugHunter.findings} />
          </SectionCard>
        )}

        {/* Quick Wins */}
        {bugHunter.quickWins && bugHunter.quickWins.length > 0 && (
          <SectionCard title="Quick Wins" subtitle="Easy fixes you can implement immediately">
            <div className="space-y-3">
              {bugHunter.quickWins.map((quickWin, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-0 backdrop-blur-xl bg-[#6BCF7F]/5 rounded-xl border border-[#6BCF7F]/20" />
                  <div className="relative z-10 p-4">
                    <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {quickWin.title}
                    </h4>
                    <p className="text-white/70 text-sm font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {quickWin.diffHint}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Empty state */}
        {(!bugHunter.findings || bugHunter.findings.length === 0) && (
          <SectionCard title="No Issues Found">
            <div className="text-center py-8">
              <div className="inline-block p-4 rounded-full bg-green-500/20 mb-4">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-green-400 font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Well done! No bugs found.
              </p>
              <p className="text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                The code appears to be clean and well-structured.
              </p>
            </div>
          </SectionCard>
        )}
      </div>
    );
  }

  // Backward compatibility: old format
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
              {bugHunter.statusMessage || (bugCount === 0 ? 'Well done! No bugs found.' : `${bugCount} bug(s) found that need attention.`)}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Overall Risk */}
      {bugHunter.overallRisk && (
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
      )}

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
