import { motion } from 'framer-motion';
import { Terminal, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

const logs = [
  { time: '14:23:45', type: 'success', message: 'Code analysis completed successfully' },
  { time: '14:23:42', type: 'info', message: 'Explainer agent finished analysis' },
  { time: '14:23:40', type: 'info', message: 'Bug Hunter agent finished analysis' },
  { time: '14:23:38', type: 'info', message: 'Complexity agent finished analysis' },
  { time: '14:23:35', type: 'warning', message: 'Performance issue detected in recursive function' },
  { time: '14:23:33', type: 'info', message: 'Debate round 5 completed' },
  { time: '14:23:30', type: 'info', message: 'Debate round 4 completed' },
  { time: '14:23:27', type: 'info', message: 'Debate round 3 completed' },
  { time: '14:23:25', type: 'info', message: 'Debate round 2 completed' },
  { time: '14:23:22', type: 'info', message: 'Debate round 1 completed' },
  { time: '14:23:20', type: 'info', message: 'Multi-agent analysis started' },
  { time: '14:23:18', type: 'success', message: 'Code input received: 7 lines of JavaScript' },
];

const logIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
};

const logColors = {
  success: '#6BCF7F',
  warning: '#FFD93D',
  info: '#4DFFFF',
};

export function SystemLogs() {
  return (
    <div className="relative">
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#4DFFFF]/20 to-[#9A4DFF]/20">
            <Terminal className="w-5 h-5 text-[#4DFFFF]" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
            System Logs
          </h2>
        </div>

        {/* Logs container */}
        <div className="space-y-2">
          {logs.map((log, idx) => {
            const Icon = logIcons[log.type as keyof typeof logIcons];
            const color = logColors[log.type as keyof typeof logColors];
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="flex items-center gap-4 px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all group"
              >
                {/* Icon */}
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color }} strokeWidth={2} />
                </div>

                {/* Time */}
                <span 
                  className="text-sm text-white/40 font-mono w-20"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {log.time}
                </span>

                {/* Message */}
                <span 
                  className="text-sm text-white/70 group-hover:text-white/90 transition-colors flex-1"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {log.message}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
