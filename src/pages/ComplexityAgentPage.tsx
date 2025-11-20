import { AgentOutputCard } from '../components/AgentOutputCard';

export function ComplexityAgentPage() {
  return (
    <div className="space-y-6">
      <AgentOutputCard 
        agentId="complexity"
        agentName="Complexity"
        agentColor="#9A4DFF"
        isAnalyzing={false}
      />
    </div>
  );
}

