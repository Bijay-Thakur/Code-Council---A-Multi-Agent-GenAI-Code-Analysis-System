import { motion } from 'framer-motion';
import { Bot, ChevronDown, ChevronUp, CheckCircle2, AlertTriangle, Scale } from 'lucide-react';
import { useState } from 'react';
import { DebateRound, DebateResult } from '../contexts/AnalysisContext';

interface DebatePanelProps {
  debate?: DebateResult;
}

const agentColors = {
  Explainer: '#4DFFFF',
  BugHunter: '#FF4D6D',
  Complexity: '#9A4DFF',
  Judge: '#FFD93D'
};

const typeLabels = {
  claim: 'Claim',
  rebuttal: 'Rebuttal',
  counter: 'Counter',
  response: 'Response',
  verdict: 'Verdict'
};

export function DebatePanel({ debate }: DebatePanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  // Handle missing or empty debate - show graceful message
  if (!debate) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No debate data available. Run code analysis first.</p>
      </div>
    );
  }
  
  // Handle empty rounds - show at least topic and consensus if available
  const hasRounds = debate.rounds && debate.rounds.length > 0;
  
  if (!hasRounds && debate.topic) {
    return (
      <div className="space-y-6">
        <div className="relative">
          <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.05] rounded-2xl border border-white/10" />
          <div className="relative z-10 p-6">
            <h3 className="text-xl text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Debate Topic
            </h3>
            <p className="text-white/80 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              {debate.topic}
            </p>
            <p className="text-white/60 text-sm">Debate rounds are being generated. Please wait...</p>
          </div>
        </div>
        {debate.consensus && (
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.05] rounded-2xl border border-white/10" />
            <div className="relative z-10 p-6">
              <h3 className="text-xl text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Consensus
              </h3>
              <p className="text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                {debate.consensus.rationale || "Consensus pending"}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (!hasRounds) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No debate rounds available yet. Analysis in progress...</p>
      </div>
    );
  }

  const toggleSection = (roundIndex: number) => {
    const newSet = new Set(expandedSections);
    if (newSet.has(roundIndex)) {
      newSet.delete(roundIndex);
    } else {
      newSet.add(roundIndex);
    }
    setExpandedSections(newSet);
  };

  // Check if new format (has consensus)
  const isNewFormat = debate.consensus && typeof debate.consensus === 'object';

  return (
    <div className="space-y-6">
      {/* Topic */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.05] rounded-2xl border border-white/10" />
        <div className="relative z-10 p-6">
          <h3 className="text-xl text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Debate Topic
          </h3>
          <p className="text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
            {debate.topic}
          </p>
        </div>
      </div>

      {/* Debate Rounds */}
      <div className="space-y-4">
        {debate.rounds.map((round, idx) => {
          const color = agentColors[round.speaker] || '#4DFFFF';
          const isExpanded = expandedSections.has(idx);
          
          // Check if new format (has claim, rebuttals, concessions, proposedFixes)
          const hasNewFields = 'claim' in round && round.claim;
          const claim = hasNewFields ? round.claim : round.text || '';
          const type = round.type || round.stance || 'claim';
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.05] rounded-2xl border border-white/10" />
              <div className="relative z-10 p-5">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Bot className="w-6 h-6" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {round.speaker}
                      </h4>
                      <span 
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ 
                          backgroundColor: `${color}20`,
                          color,
                          border: `1px solid ${color}40`
                        }}
                      >
                        Round {round.round} • {typeLabels[type as keyof typeof typeLabels] || type}
                      </span>
                    </div>
                    <p className="text-white/80 whitespace-pre-wrap mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {claim}
                    </p>
                  </div>
                </div>

                {/* Evidence */}
                {round.evidence && round.evidence.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors mb-2"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Evidence ({round.evidence.length})
                      </span>
                    </button>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 space-y-2"
                      >
                        {round.evidence.map((evidence, evIdx) => (
                          <div
                            key={evIdx}
                            className="p-3 rounded-lg bg-[#4DFFFF]/5 border border-[#4DFFFF]/20"
                          >
                            <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {evidence}
                            </p>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Rebuttals */}
                {hasNewFields && round.rebuttals && round.rebuttals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h5 className="text-white/80 font-semibold mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Rebuttals:
                    </h5>
                    <div className="space-y-2">
                      {round.rebuttals.map((rebuttal, rbIdx) => (
                        <div
                          key={rbIdx}
                          className="p-3 rounded-lg bg-[#FF4D6D]/5 border border-[#FF4D6D]/20"
                        >
                          <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {rebuttal}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concessions */}
                {hasNewFields && round.concessions && round.concessions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h5 className="text-white/80 font-semibold mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Concessions:
                    </h5>
                    <div className="space-y-2">
                      {round.concessions.map((concession, cnIdx) => (
                        <div
                          key={cnIdx}
                          className="p-3 rounded-lg bg-[#FFD93D]/5 border border-[#FFD93D]/20"
                        >
                          <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {concession}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proposed Fixes */}
                {hasNewFields && round.proposedFixes && round.proposedFixes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h5 className="text-white/80 font-semibold mb-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Proposed Fixes:
                    </h5>
                    <div className="space-y-2">
                      {round.proposedFixes.map((fix, fixIdx) => (
                        <div
                          key={fixIdx}
                          className="p-3 rounded-lg bg-[#6BCF7F]/5 border border-[#6BCF7F]/20"
                        >
                          <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {fix}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Consensus (New Format) */}
      {isNewFormat && debate.consensus && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-[#FFD93D]/10 to-[#9A4DFF]/10 rounded-2xl border-2 border-[#FFD93D]/30" />
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-[#FFD93D]/20">
                <Scale className="w-6 h-6 text-[#FFD93D]" />
              </div>
              <h3 className="text-xl text-white font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Consensus
              </h3>
            </div>
            
            {/* Production Ready Status */}
            <div className="mb-4 p-4 rounded-xl border" style={{
              backgroundColor: debate.consensus.isProductionReady ? 'rgba(107, 207, 127, 0.1)' : 'rgba(255, 77, 109, 0.1)',
              borderColor: debate.consensus.isProductionReady ? 'rgba(107, 207, 127, 0.3)' : 'rgba(255, 77, 109, 0.3)'
            }}>
              <div className="flex items-center gap-3">
                {debate.consensus.isProductionReady ? (
                  <CheckCircle2 className="w-6 h-6 text-[#6BCF7F]" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-[#FF4D6D]" />
                )}
                <div>
                  <p className={`text-lg font-semibold ${
                    debate.consensus.isProductionReady ? 'text-[#6BCF7F]' : 'text-[#FF4D6D]'
                  }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {debate.consensus.isProductionReady ? 'Production Ready' : 'Not Production Ready'}
                  </p>
                  <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {debate.consensus.isProductionReady 
                      ? 'Code is ready for production deployment' 
                      : 'Code needs improvements before production'}
                  </p>
                </div>
              </div>
            </div>

            {/* Top Priorities - handle string array or object array */}
            {debate.consensus.topPriorities && debate.consensus.topPriorities.length > 0 && (
              <div className="mb-4">
                <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Top Priorities
                </h4>
                <div className="space-y-2">
                  {debate.consensus.topPriorities.map((priority, idx) => {
                    // Handle both string array and object array formats
                    if (typeof priority === 'string') {
                      return (
                        <div key={idx} className="relative">
                          <div className="absolute inset-0 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10" />
                          <div className="relative z-10 p-4 flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFD93D]/20 flex items-center justify-center text-[#FFD93D] font-bold text-sm">
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {priority}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="relative">
                        <div className="absolute inset-0 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10" />
                        <div className="relative z-10 p-4 flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#FFD93D]/20 flex items-center justify-center text-[#FFD93D] font-bold text-sm">
                            {priority.priority || idx + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="text-white font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {priority.item || String(priority)}
                            </h5>
                            {priority.why && (
                              <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                                {priority.why}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Rationale */}
            {debate.consensus.rationale && (
              <div>
                <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Rationale
                </h4>
                <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {debate.consensus.rationale}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Judge Summary (Backward Compatibility) */}
      {!isNewFormat && debate.judgeSummary && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-[#FFD93D]/10 to-[#9A4DFF]/10 rounded-2xl border-2 border-[#FFD93D]/30" />
          <div className="relative z-10 p-6">
            <h3 className="text-xl text-white font-semibold mb-3 flex items-center gap-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="text-2xl">⚖️</span>
              Judge Verdict
            </h3>
            <div className="mb-4">
              <span 
                className="px-4 py-2 rounded-xl text-white font-semibold"
                style={{ 
                  backgroundColor: `${agentColors[debate.judgeSummary.winner]}40`,
                  border: `1px solid ${agentColors[debate.judgeSummary.winner]}`
                }}
              >
                Winner: {debate.judgeSummary.winner}
              </span>
            </div>
            <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
              {debate.judgeSummary.reason}
            </p>
          </div>
        </motion.div>
      )}

      {/* Debug info (only in dev mode) */}
      {(() => {
        try {
          return (import.meta as any).env?.DEV || (import.meta as any).env?.MODE === 'development';
        } catch {
          return false;
        }
      })() && (debate as any)._debug && (
        <div className="relative mt-6">
          <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.05] rounded-2xl border border-white/10" />
          <div className="relative z-10 p-6">
            <h3 className="text-xl text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Debug Info (Development Only)
            </h3>
            <pre className="text-white/60 text-xs overflow-auto max-h-40 p-3 rounded bg-white/5 custom-scrollbar">
              {JSON.stringify((debate as any)._debug, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
