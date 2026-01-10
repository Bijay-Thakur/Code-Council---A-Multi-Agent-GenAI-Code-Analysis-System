import { useAnalysis } from '../contexts/AnalysisContext';
import { SectionCard } from '../components/ui/SectionCard';
import { StepList } from '../components/ui/StepList';
import { ConceptChips } from '../components/ui/ConceptChips';
import { BulletList } from '../components/ui/BulletList';

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

  // Check if new schema format (has overview and purpose) - but handle partial data
  const hasOverview = explainer.overview && explainer.overview !== "Unable to parse explainer response" && 
                     explainer.overview !== "Code analysis is being processed. Please wait or check system logs.";
  const hasPurpose = explainer.purpose && explainer.purpose !== "Error occurred during analysis" &&
                    explainer.purpose !== "Analyzing code structure and functionality";
  const isNewFormat = hasOverview || hasPurpose || explainer.blockByBlock?.length > 0;

  // Fallback for old format (backward compatibility)
  if (!isNewFormat && ('text' in explainer && typeof explainer.text === 'string')) {
    return (
      <div className="space-y-6">
        <SectionCard title="Explanation">
          <p className="text-white/80 whitespace-pre-wrap">{explainer.text}</p>
        </SectionCard>
      </div>
    );
  }

  // Render new format - handle partial data gracefully
  if (isNewFormat) {
    return (
      <div className="space-y-6">
        {/* Overview and Purpose - render even if partial */}
        {(hasOverview || hasPurpose) && (
          <SectionCard 
            title="Overview" 
            subtitle={hasPurpose ? explainer.purpose : undefined}
          >
            <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
              {hasOverview ? explainer.overview : (explainer.purpose || "Analysis in progress...")}
            </p>
          </SectionCard>
        )}
        
        {/* Key Identifiers (new field) - handle as string array or convert for ConceptChips */}
        {(explainer as any).keyIdentifiers && (explainer as any).keyIdentifiers.length > 0 && (
          <SectionCard title="Key Identifiers" subtitle="Important code elements referenced">
            <div className="flex flex-wrap gap-2">
              {((explainer as any).keyIdentifiers as string[]).map((id, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-[#4DFFFF]/20 to-[#9A4DFF]/20 border border-[#4DFFFF]/30 text-[#4DFFFF] text-sm font-mono hover:border-[#4DFFFF]/50 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {id}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Inputs - show even if empty with message */}
        {explainer.inputs && explainer.inputs.length > 0 && (
          <SectionCard title="Inputs" subtitle="Expected parameters and types">
            <div className="space-y-3">
              {explainer.inputs.map((input, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-0 backdrop-blur-xl bg-[#4DFFFF]/5 rounded-xl border border-[#4DFFFF]/20" />
                  <div className="relative z-10 p-4">
                    <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {input.name} <span className="text-[#4DFFFF]">({input.typeGuess})</span>
                    </h4>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {input.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Outputs */}
        {explainer.outputs && explainer.outputs.length > 0 && (
          <SectionCard title="Outputs" subtitle="Return values and types">
            <div className="space-y-3">
              {explainer.outputs.map((output, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-0 backdrop-blur-xl bg-[#9A4DFF]/5 rounded-xl border border-[#9A4DFF]/20" />
                  <div className="relative z-10 p-4">
                    <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {output.name} <span className="text-[#9A4DFF]">({output.typeGuess})</span>
                    </h4>
                    <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {output.notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Block by Block Explanation */}
        {explainer.blockByBlock && explainer.blockByBlock.length > 0 && (
          <SectionCard title="Block-by-Block Explanation" subtitle="Detailed breakdown of code structure">
            <div className="space-y-4">
              {explainer.blockByBlock.map((block, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute inset-0 backdrop-blur-xl bg-white/5 rounded-xl border border-white/10" />
                  <div className="relative z-10 p-4">
                    <h4 className="text-white font-semibold mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {block.title}
                    </h4>
                    <p className="text-white/80 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {block.whatHappens}
                    </p>
                    <p className="text-white/70 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="font-semibold">Why it matters:</span> {block.whyItMatters}
                    </p>
                    {block.identifiers && block.identifiers.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {block.identifiers.map((id, i) => (
                          <span key={i} className="px-2 py-1 rounded-lg bg-[#4DFFFF]/10 text-[#4DFFFF] text-xs font-mono">
                            {id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Example Trace */}
        {explainer.exampleTrace && explainer.exampleTrace.length > 0 && (
          <SectionCard title="Example Trace" subtitle="Step-by-step execution walkthrough">
            <div className="space-y-3">
              {explainer.exampleTrace.map((step) => (
                <div key={step.step} className="relative">
                  <div className="absolute inset-0 backdrop-blur-xl bg-[#4DFFFF]/5 rounded-xl border border-[#4DFFFF]/20" />
                  <div className="relative z-10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4DFFFF]/20 flex items-center justify-center text-[#4DFFFF] font-bold text-sm">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <p className="text-white/90 font-mono text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {step.state}
                        </p>
                        <p className="text-white/80 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {step.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Edge Cases - handle string or object format */}
        {explainer.edgeCases && explainer.edgeCases.length > 0 ? (
          <SectionCard title="Edge Cases" subtitle="Special cases to consider">
            <div className="space-y-3">
              {explainer.edgeCases.map((edgeCase, idx) => {
                if (typeof edgeCase === 'string') {
                  return (
                    <div key={idx} className="relative">
                      <div className="absolute inset-0 backdrop-blur-xl bg-[#FFD93D]/5 rounded-xl border border-[#FFD93D]/20" />
                      <div className="relative z-10 p-4">
                        <p className="text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {edgeCase}
                        </p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="relative">
                    <div className="absolute inset-0 backdrop-blur-xl bg-[#FFD93D]/5 rounded-xl border border-[#FFD93D]/20" />
                    <div className="relative z-10 p-4">
                      <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {edgeCase.case || String(edgeCase)}
                      </h4>
                      {edgeCase.impact && (
                        <p className="text-white/80 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="font-semibold">Impact:</span> {edgeCase.impact}
                        </p>
                      )}
                      {edgeCase.suggestion && (
                        <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="font-semibold">Suggestion:</span> {edgeCase.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="Edge Cases" subtitle="Special cases to consider">
            <p className="text-white/60 text-sm">No edge cases identified yet. Analysis in progress...</p>
          </SectionCard>
        )}

        {/* Improvements - handle string or object format */}
        {explainer.improvements && explainer.improvements.length > 0 ? (
          <SectionCard title="Suggested Improvements" subtitle="Ways to enhance the code">
            <div className="space-y-3">
              {explainer.improvements.map((improvement, idx) => {
                if (typeof improvement === 'string') {
                  return (
                    <div key={idx} className="relative">
                      <div className="absolute inset-0 backdrop-blur-xl bg-[#6BCF7F]/5 rounded-xl border border-[#6BCF7F]/20" />
                      <div className="relative z-10 p-4">
                        <p className="text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {improvement}
                        </p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={idx} className="relative">
                    <div className="absolute inset-0 backdrop-blur-xl bg-[#6BCF7F]/5 rounded-xl border border-[#6BCF7F]/20" />
                    <div className="relative z-10 p-4">
                      <h4 className="text-white font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {improvement.title || String(improvement)}
                      </h4>
                      {improvement.change && (
                        <p className="text-white/80 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="font-semibold">Change:</span> {improvement.change}
                        </p>
                      )}
                      {improvement.benefit && (
                        <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="font-semibold">Benefit:</span> {improvement.benefit}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        ) : (
          <SectionCard title="Suggested Improvements" subtitle="Ways to enhance the code">
            <p className="text-white/60 text-sm">No improvements suggested yet. Analysis in progress...</p>
          </SectionCard>
        )}
        
        {/* Debug info (only in dev) */}
        {(() => {
          try {
            return (import.meta as any).env?.DEV || (import.meta as any).env?.MODE === 'development';
          } catch {
            return false;
          }
        })() && (explainer as any)._debug && (
          <SectionCard title="Debug Info" subtitle="Development only - raw LLM output preview">
            <pre className="text-white/60 text-xs overflow-auto max-h-40 p-3 rounded bg-white/5 custom-scrollbar">
              {JSON.stringify((explainer as any)._debug, null, 2)}
            </pre>
          </SectionCard>
        )}
      </div>
    );
  }

  // Fallback: render old format if available
  return (
    <div className="space-y-6">
      {explainer.title && (
        <SectionCard title={explainer.title} subtitle={explainer.summary}>
          <div />
        </SectionCard>
      )}
      
      {explainer.whatItDoes && (
        <SectionCard title="What This Code Does" subtitle="Purpose and goal">
          <p className="text-white/80 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
            {explainer.whatItDoes}
          </p>
        </SectionCard>
      )}

      {explainer.stepByStep && explainer.stepByStep.length > 0 && (
        <SectionCard title="Step by Step" subtitle="How the code works">
          <StepList steps={explainer.stepByStep} />
        </SectionCard>
      )}

      {explainer.keyConcepts && explainer.keyConcepts.length > 0 && (
        <SectionCard title="Key Concepts" subtitle="Important concepts to understand">
          <ConceptChips concepts={explainer.keyConcepts} />
        </SectionCard>
      )}

      {explainer.edgeCases && Array.isArray(explainer.edgeCases) && explainer.edgeCases.length > 0 && (
        <SectionCard title="Edge Cases" subtitle="Special cases to consider">
          {typeof explainer.edgeCases[0] === 'string' ? (
            <BulletList items={explainer.edgeCases as string[]} />
          ) : (
            <BulletList items={(explainer.edgeCases as any[]).map((e: any) => typeof e === 'string' ? e : (e?.case || String(e)))} />
          )}
        </SectionCard>
      )}

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
