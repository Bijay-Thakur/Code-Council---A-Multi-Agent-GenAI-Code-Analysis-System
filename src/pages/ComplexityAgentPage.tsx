import { useAnalysis } from '../contexts/AnalysisContext';
import { SectionCard } from '../components/ui/SectionCard';
import { BulletList } from '../components/ui/BulletList';
import { motion } from 'framer-motion';
import { Clock, HardDrive, Zap, TrendingUp } from 'lucide-react';

export function ComplexityAgentPage() {
  const { results, isLoading } = useAnalysis();
  const complexity = results?.complexity;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Analyzing code...</p>
      </div>
    );
  }

  if (!complexity) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No analysis available. Run code analysis first.</p>
      </div>
    );
  }

  // Fallback for old format (backward compatibility)
  if ('text' in complexity && typeof complexity.text === 'string') {
    return (
      <div className="space-y-6">
        <SectionCard title="Complexity Analysis">
          <p className="text-white/80 whitespace-pre-wrap">{complexity.text}</p>
        </SectionCard>
      </div>
    );
  }

  // Check if new format (has time and space as objects with bigO and reasoning)
  const isNewFormat = complexity.time && typeof complexity.time === 'object' && 'bigO' in complexity.time;

  if (isNewFormat) {
    const timeComplexity = complexity.time as { bigO: string; reasoning: string };
    const spaceComplexity = complexity.space as { bigO: string; reasoning: string };

    return (
      <div className="space-y-6">
        {/* Time and Space Complexity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard title="Time Complexity" subtitle={timeComplexity.reasoning}>
            <div className="flex items-center gap-4 mt-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#4DFFFF]/20 to-[#9A4DFF]/20">
                <Clock className="w-6 h-6 text-[#4DFFFF]" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {timeComplexity.bigO}
                </p>
                <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Time complexity
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Space Complexity" subtitle={spaceComplexity.reasoning}>
            <div className="flex items-center gap-4 mt-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#9A4DFF]/20 to-[#FF4D6D]/20">
                <HardDrive className="w-6 h-6 text-[#9A4DFF]" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {spaceComplexity.bigO}
                </p>
                <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Space complexity
                </p>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Hotspots */}
        {complexity.hotspots && complexity.hotspots.length > 0 && (
          <SectionCard title="Performance Hotspots" subtitle="Areas that may impact performance">
            <div className="space-y-3">
              {complexity.hotspots.map((hotspot, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-0 backdrop-blur-xl bg-[#FF4D6D]/5 rounded-xl border border-[#FF4D6D]/20" />
                  <div className="relative z-10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#FF4D6D]/20">
                        <Zap className="w-5 h-5 text-[#FF4D6D]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold mb-1 font-mono text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {hotspot.where}
                        </h4>
                        <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {hotspot.why}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Optimizations */}
        {complexity.optimizations && complexity.optimizations.length > 0 && (
          <SectionCard title="Optimization Suggestions" subtitle="Ways to improve performance">
            <div className="space-y-4">
              {complexity.optimizations.map((opt, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-0 backdrop-blur-xl bg-[#6BCF7F]/5 rounded-xl border border-[#6BCF7F]/20" />
                  <div className="relative z-10 p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-[#6BCF7F]/20">
                        <TrendingUp className="w-5 h-5 text-[#6BCF7F]" />
                      </div>
                      <h4 className="text-white font-semibold flex-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {opt.title}
                      </h4>
                    </div>
                    <p className="text-white/80 text-sm mb-2 ml-9" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="font-semibold">What to change:</span> {opt.whatToChange}
                    </p>
                    <p className="text-white/70 text-sm ml-9" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="font-semibold">Expected impact:</span> {opt.expectedImpact}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    );
  }

  // Backward compatibility: old format
  return (
    <div className="space-y-6">
      {/* Time and Space Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SectionCard title="Time Complexity">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#4DFFFF]/20 to-[#9A4DFF]/20">
              <Clock className="w-6 h-6 text-[#4DFFFF]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                {typeof complexity.time === 'string' ? complexity.time : 'O(n)'}
              </p>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Time complexity
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Space Complexity">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#9A4DFF]/20 to-[#FF4D6D]/20">
              <HardDrive className="w-6 h-6 text-[#9A4DFF]" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white font-mono" style={{ fontFamily: 'Inter, sans-serif' }}>
                {typeof complexity.space === 'string' ? complexity.space : 'O(1)'}
              </p>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Space complexity
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Dominant Operations */}
      {complexity.dominantOperations && complexity.dominantOperations.length > 0 && (
        <SectionCard title="Dominant Operations" subtitle="Key operations affecting performance">
          <BulletList items={complexity.dominantOperations} />
        </SectionCard>
      )}

      {/* Notes */}
      {complexity.notes && complexity.notes.length > 0 && (
        <SectionCard title="Analysis Notes" subtitle="Important observations">
          <BulletList items={complexity.notes} />
        </SectionCard>
      )}

      {/* Improvements */}
      {complexity.improvements && complexity.improvements.length > 0 && (
        <SectionCard title="Improvement Suggestions" subtitle="Ways to optimize performance">
          <BulletList items={complexity.improvements} />
        </SectionCard>
      )}
    </div>
  );
}
