import { motion } from 'framer-motion';
import { Terminal, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface Log {
  ts: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

interface SystemLogsProps {
  logs?: Log[];
}

const defaultLogs: Log[] = [
  { ts: new Date().toISOString(), level: 'info', message: 'No logs available. Run code analysis first.' }
];

const logIcons = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  error: AlertTriangle,
  warn: AlertTriangle,
};

const logColors = {
  success: '#6BCF7F',
  warning: '#FFD93D',
  info: '#4DFFFF',
  error: '#FF4D6D',
  warn: '#FFD93D',
};

export function SystemLogs({ logs = defaultLogs }: SystemLogsProps) {
  const displayLogs = logs.length > 0 ? logs : defaultLogs;
  
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  
  const getLogType = (level: string) => {
    if (level === 'error') return 'error';
    if (level === 'warn') return 'warning';
    return 'info';
  };
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
        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {displayLogs.map((log, idx) => {
            const logType = getLogType(log.level);
            const Icon = logIcons[logType as keyof typeof logIcons];
            const color = logColors[logType as keyof typeof logColors];
            
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
                  className="text-sm text-white/40 font-mono w-24"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {formatTime(log.ts)}
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
