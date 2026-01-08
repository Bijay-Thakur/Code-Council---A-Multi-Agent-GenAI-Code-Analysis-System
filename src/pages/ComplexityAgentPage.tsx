import { useAnalysis } from '../contexts/AnalysisContext';
import { SectionCard } from '../components/ui/SectionCard';
import { BulletList } from '../components/ui/BulletList';
import { motion } from 'framer-motion';
import { Clock, HardDrive } from 'lucide-react';

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
              <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                {complexity.time || 'O(n)'}
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
              <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
                {complexity.space || 'O(1)'}
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
