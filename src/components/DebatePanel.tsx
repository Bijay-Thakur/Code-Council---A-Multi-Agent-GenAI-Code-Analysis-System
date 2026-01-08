import { motion } from 'framer-motion';
import { Bot, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { DebateRound } from '../contexts/AnalysisContext';

interface DebatePanelProps {
  debate?: {
    topic: string;
    rounds: DebateRound[];
    judgeSummary: {
      winner: 'Explainer' | 'BugHunter' | 'Complexity';
      reason: string;
    };
  };
}

const agentColors = {
  Explainer: '#4DFFFF',
  BugHunter: '#FF4D6D',
  Complexity: '#9A4DFF'
};

const stanceLabels = {
  claim: 'Claim',
  rebuttal: 'Rebuttal',
  counter: 'Counter'
};

export function DebatePanel({ debate }: DebatePanelProps) {
  const [expandedEvidence, setExpandedEvidence] = useState<Set<number>>(new Set());

  if (!debate || !debate.rounds || debate.rounds.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No debate data available.</p>
      </div>
    );
  }

  const toggleEvidence = (roundIndex: number) => {
    const newSet = new Set(expandedEvidence);
    if (newSet.has(roundIndex)) {
      newSet.delete(roundIndex);
    } else {
      newSet.add(roundIndex);
    }
    setExpandedEvidence(newSet);
  };

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
          const isEvidenceExpanded = expandedEvidence.has(idx);
          
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
                        Round {round.round} • {stanceLabels[round.stance]}
                      </span>
                    </div>
                    <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {round.text}
                    </p>
                  </div>
                </div>

                {/* Evidence */}
                {round.evidence && round.evidence.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => toggleEvidence(idx)}
                      className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
                    >
                      {isEvidenceExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Evidence ({round.evidence.length})
                      </span>
                    </button>
                    {isEvidenceExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 space-y-2"
                      >
                        {round.evidence.map((evidence, evIdx) => (
                          <div
                            key={evIdx}
                            className="p-3 rounded-lg bg-white/5 border border-white/10"
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
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Judge Summary */}
      {debate.judgeSummary && (
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
    </div>
  );
}
