import { AgentOutputCard } from '../components/AgentOutputCard';

export function BugHunterAgentPage() {
  return (
    <div className="space-y-6">
      <AgentOutputCard 
        agentId="bug-hunter"
        agentName="Bug Hunter"
        agentColor="#FF4D6D"
        isAnalyzing={false}
      />
    </div>
  );
}

