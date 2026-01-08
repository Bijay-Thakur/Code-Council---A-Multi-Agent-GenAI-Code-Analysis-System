import { SystemLogs } from '../components/SystemLogs';
import { useAnalysis } from '../contexts/AnalysisContext';

export function SystemLogsPage() {
  const { logs } = useAnalysis();
  return <SystemLogs logs={logs} />;
}

