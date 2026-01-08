import { motion } from 'framer-motion';
import { Lightbulb, Bug, BarChart3, MessageSquare, CheckCircle2, Network } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  model: string;
  version: string;
  description: string;
  icon: typeof Lightbulb;
  color: string;
}

const agents: Agent[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    role: 'Workflow Coordination & Routing',
    model: 'gpt-4o-mini',
    version: 'v1.0',
    description: 'Coordinates the multi-agent analysis workflow. Creates execution plans, routes tasks to specialized agents, and manages the overall analysis pipeline with comprehensive logging.',
    icon: Network,
    color: '#00D4FF'
  },
  {
    id: 'explainer',
    name: 'Explainer Agent',
    role: 'Code Simplification & Explanation',
    model: 'gemini-1.5-flash / gpt-4o-mini',
    version: 'v1.0',
    description: 'Helps simplify and explain code in clear, understandable terms. Breaks down complex logic and makes code accessible to developers of all levels.',
    icon: Lightbulb,
    color: '#4DFFFF'
  },
  {
    id: 'bug-hunter',
    name: 'Bug Hunter Agent',
    role: 'Vulnerability & Issue Detection',
    model: 'gpt-4o-mini',
    version: 'v1.0',
    description: 'Detects flaws, vulnerabilities, and logic issues in your code. Identifies potential bugs before they reach production.',
    icon: Bug,
    color: '#FF4D6D'
  },
  {
    id: 'complexity',
    name: 'Complexity Analyst Agent',
    role: 'Performance & Complexity Analysis',
    model: 'gpt-4o-mini',
    version: 'v1.0',
    description: 'Computes time and space complexity, analyzes performance metrics, and provides optimization recommendations.',
    icon: BarChart3,
    color: '#9A4DFF'
  },
  {
    id: 'debate',
    name: 'Debate Agent',
    role: 'Argument & Counterargument',
    model: 'gemini-1.5-flash / gpt-4o-mini',
    version: 'v1.0',
    description: 'Conducts argument and counterargument rounds to challenge assumptions and improve code quality through rigorous debate.',
    icon: MessageSquare,
    color: '#FFD93D'
  },
  {
    id: 'supervisor',
    name: 'Supervisor Agent',
    role: 'Final Synthesis & Verdict',
    model: 'gpt-4o-mini',
    version: 'v2.0',
    description: 'Synthesizes the final verdict by merging all agent results. Provides comprehensive recommendations based on collective analysis.',
    icon: CheckCircle2,
    color: '#6BCF7F'
  },
];

export function AgentsPage() {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF]">
              Meet the Code Council Agents
            </span>
          </h1>
          <p 
            className="text-xl text-white/70 max-w-3xl mx-auto"
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
          >
            A team of specialized GenAI agents collaborating to analyze and refine your code.
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, idx) => {
            const Icon = agent.icon;
            
            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                {/* Glass card */}
                <div 
                  className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border transition-all"
                  style={{
                    borderColor: `${agent.color}30`
                  }}
                />
                
                {/* Hover glow effect - subtle */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-2xl"
                  style={{
                    backgroundColor: agent.color,
                    boxShadow: `0 0 30px ${agent.color}20`
                  }}
                />
                
                {/* Subtle border glow on hover */}
                <div 
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                  style={{
                    border: `1px solid ${agent.color}40`,
                    boxShadow: `inset 0 0 20px ${agent.color}10`
                  }}
                />

                <div className="relative z-10 p-6">
                  {/* Agent Avatar/Icon */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      {/* Glow behind icon */}
                      <div 
                        className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                        style={{ backgroundColor: agent.color }}
                      />
                      {/* Icon container */}
                      <div 
                        className="relative p-4 rounded-2xl border"
                        style={{ 
                          backgroundColor: `${agent.color}20`,
                          borderColor: `${agent.color}40`
                        }}
                      >
                        <Icon 
                          className="w-8 h-8" 
                          style={{ color: agent.color }} 
                          strokeWidth={2}
                        />
                      </div>
                    </div>

                    {/* Version badge */}
                    <div className="ml-auto">
                      <div className="px-3 py-1 rounded-full backdrop-blur-xl bg-white/5 border border-white/10">
                        <span 
                          className="text-xs text-white/70"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}
                        >
                          {agent.version}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Name */}
                  <h3 
                    className="text-2xl text-white mb-2"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
                  >
                    {agent.name}
                  </h3>

                  {/* Role */}
                  <div className="mb-4">
                    <span 
                      className="text-sm px-3 py-1 rounded-full backdrop-blur-xl border"
                      style={{ 
                        backgroundColor: `${agent.color}15`,
                        borderColor: `${agent.color}30`,
                        color: agent.color,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: '500'
                      }}
                    >
                      {agent.role}
                    </span>
                  </div>

                  {/* Model */}
                  <div className="mb-4 flex items-center gap-2">
                    <span 
                      className="text-xs text-white/50"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Model:
                    </span>
                    <span 
                      className="text-xs text-white/70 font-mono"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      {agent.model}
                    </span>
                  </div>

                  {/* Description */}
                  <p 
                    className="text-sm text-white/60 leading-relaxed"
                    style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
                  >
                    {agent.description}
                  </p>

                  {/* Bottom accent line */}
                  <div 
                    className="mt-4 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20"
                    style={{ color: agent.color }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-2xl border border-white/10" />
            <div className="relative z-10 px-8 py-4">
              <p 
                className="text-sm text-white/50"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                All agents work collaboratively to provide comprehensive code analysis
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

