import { AgentOutputCard } from '../components/AgentOutputCard';

export function ExplainerAgentPage() {
  return (
    <div className="space-y-6">
      <AgentOutputCard 
        agentId="explainer"
        agentName="Explainer"
        agentColor="#4DFFFF"
        isAnalyzing={false}
      />
    </div>
  );
}

