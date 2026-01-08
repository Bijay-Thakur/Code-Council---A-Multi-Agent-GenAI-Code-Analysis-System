import { DebatePanel } from '../components/DebatePanel';
import { useAnalysis } from '../contexts/AnalysisContext';

export function DebatePanelPage() {
  const { results, isLoading } = useAnalysis();
  const debate = results?.debate;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60">Analyzing code...</p>
      </div>
    );
  }

  return <DebatePanel debate={debate} />;
}
