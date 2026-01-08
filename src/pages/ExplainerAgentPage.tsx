import { useAnalysis } from '../contexts/AnalysisContext';
import { SectionCard } from '../components/ui/SectionCard';
import { StepList } from '../components/ui/StepList';
import { ConceptChips } from '../components/ui/ConceptChips';
import { BulletList } from '../components/ui/BulletList';
import { CodeBlock } from '../components/ui/CodeBlock';

export function ExplainerAgentPage() {
  const { results, isLoading } = useAnalysis();
  const explainer = results?.explainer;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Analyzing code...</p>
      </div>
    );
  }

  if (!explainer) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">No analysis available. Run code analysis first.</p>
      </div>
    );
  }

  // Fallback for old format (backward compatibility)
  if ('text' in explainer && typeof explainer.text === 'string') {
    return (
      <div className="space-y-6">
        <SectionCard title="Explanation">
          <p className="text-white/80 whitespace-pre-wrap">{explainer.text}</p>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title and Summary */}
      <SectionCard title={explainer.title || 'Code Explanation'} subtitle={explainer.summary}>
        <div />
      </SectionCard>

      {/* What It Does */}
      {explainer.whatItDoes && (
        <SectionCard title="What This Code Does" subtitle="Purpose and goal">
          <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
            {explainer.whatItDoes}
          </p>
        </SectionCard>
      )}

      {/* Input/Output */}
      {explainer.inputOutput && (
        <SectionCard title="Input & Output" subtitle="Expected parameters and return values">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-0 backdrop-blur-xl bg-[#4DFFFF]/5 rounded-xl border border-[#4DFFFF]/20" />
              <div className="relative z-10 p-4">
                <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Input
                </h4>
                <p className="text-white/80 text-sm whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {explainer.inputOutput.input}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 backdrop-blur-xl bg-[#9A4DFF]/5 rounded-xl border border-[#9A4DFF]/20" />
              <div className="relative z-10 p-4">
                <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Output
                </h4>
                <p className="text-white/80 text-sm whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {explainer.inputOutput.output}
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Step by Step */}
      {explainer.stepByStep && explainer.stepByStep.length > 0 && (
        <SectionCard title="Step by Step" subtitle="How the code works">
          <StepList steps={explainer.stepByStep} />
        </SectionCard>
      )}

      {/* Key Concepts */}
      {explainer.keyConcepts && explainer.keyConcepts.length > 0 && (
        <SectionCard title="Key Concepts" subtitle="Important concepts to understand">
          <ConceptChips concepts={explainer.keyConcepts} />
        </SectionCard>
      )}

      {/* Edge Cases */}
      {explainer.edgeCases && explainer.edgeCases.length > 0 && (
        <SectionCard title="Edge Cases" subtitle="Special cases to consider">
          <BulletList items={explainer.edgeCases} />
        </SectionCard>
      )}

      {/* Example Walkthrough */}
      {explainer.exampleWalkthrough && (
        <SectionCard title="Example Walkthrough" subtitle="Detailed execution example">
          <div className="relative">
            <div className="absolute inset-0 backdrop-blur-xl bg-[#4DFFFF]/5 rounded-xl border border-[#4DFFFF]/20" />
            <div className="relative z-10 p-4">
              <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                {explainer.exampleWalkthrough}
              </p>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
