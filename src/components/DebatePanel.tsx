import { motion } from 'framer-motion';
import { Bot, RotateCcw } from 'lucide-react';

const debateMessages = [
  {
    round: 1,
    agent: 'A',
    name: 'Explainer',
    color: '#4DFFFF',
    message: 'This recursive Fibonacci implementation is clean and demonstrates the mathematical definition perfectly. It\'s ideal for teaching purposes.'
  },
  {
    round: 2,
    agent: 'B',
    name: 'Bug Hunter',
    color: '#FF4D6D',
    message: 'I strongly disagree. The exponential time complexity O(2^n) makes this unsuitable for any real-world use. It will cause performance issues even for modest inputs.'
  },
  {
    round: 3,
    agent: 'A',
    name: 'Explainer',
    color: '#4DFFFF',
    message: 'You raise a valid point about performance. However, the code clarity shouldn\'t be dismissed. For n < 20, the performance impact is negligible in most applications.'
  },
  {
    round: 4,
    agent: 'B',
    name: 'Bug Hunter',
    color: '#FF4D6D',
    message: 'But why accept technical debt? We should implement memoization from the start. It maintains the recursive structure while achieving O(n) complexity. Best of both worlds.'
  },
  {
    round: 5,
    agent: 'A',
    name: 'Explainer',
    color: '#4DFFFF',
    message: 'Agreed. A memoized version would be the optimal solution. It preserves the elegant recursive approach while addressing your performance concerns.'
  },
];

export function DebatePanel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
        
        <div className="relative z-10 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
              Agent Debate Chamber
            </h2>
            <p className="text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
              Watch AI agents discuss and refine the analysis
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#4DFFFF]/50 transition-all group"
          >
            <RotateCcw className="w-4 h-4 text-white/70 group-hover:text-[#4DFFFF] transition-colors" strokeWidth={2} />
            <span className="text-sm text-white/70 group-hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
              Replay Debate
            </span>
          </motion.button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
        
        <div className="relative z-10 p-8">
          <div className="space-y-6">
            {debateMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.agent === 'A' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`flex gap-4 ${msg.agent === 'B' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div 
                      className="absolute inset-0 rounded-2xl blur-xl opacity-40"
                      style={{ backgroundColor: msg.color }}
                    />
                    <div 
                      className="relative p-3 rounded-2xl border"
                      style={{ 
                        backgroundColor: `${msg.color}20`,
                        borderColor: `${msg.color}40`
                      }}
                    >
                      <Bot className="w-6 h-6" style={{ color: msg.color }} strokeWidth={2} />
                    </div>
                  </div>
                  
                  {/* Agent label */}
                  <div className="text-center mt-2">
                    <p className="text-xs text-white/50" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Agent {msg.agent}
                    </p>
                  </div>
                </div>

                {/* Message bubble */}
                <div className={`flex-1 max-w-2xl ${msg.agent === 'B' ? 'text-right' : ''}`}>
                  {/* Round indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="px-3 py-1 rounded-full text-xs backdrop-blur-xl border"
                      style={{ 
                        backgroundColor: `${msg.color}15`,
                        borderColor: `${msg.color}30`,
                        color: msg.color
                      }}
                    >
                      Round {msg.round}
                    </div>
                    <span className="text-sm text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {msg.name}
                    </span>
                  </div>

                  {/* Message */}
                  <div className="relative inline-block">
                    {/* Glow */}
                    <div 
                      className="absolute inset-0 rounded-2xl blur-lg opacity-20"
                      style={{ backgroundColor: msg.color }}
                    />
                    
                    {/* Bubble */}
                    <div 
                      className="relative backdrop-blur-xl rounded-2xl p-4 border"
                      style={{ 
                        backgroundColor: `${msg.color}10`,
                        borderColor: `${msg.color}30`
                      }}
                    >
                      <p 
                        className="text-white/90 text-left"
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}
                      >
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Consensus badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="inline-block px-8 py-4 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-[#4DFFFF]/20 to-[#9A4DFF]/20 border border-white/20">
              <p className="text-sm text-white/70 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Consensus Reached
              </p>
              <p className="text-lg text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                Implement memoized recursive solution
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
