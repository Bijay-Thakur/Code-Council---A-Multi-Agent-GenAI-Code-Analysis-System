import { motion } from 'framer-motion';
import { AlertTriangle, Info, XCircle } from 'lucide-react';

interface Finding {
  severity: 'low' | 'medium' | 'high';
  title: string;
  whyItMatters: string;
  whereInCode: string;
  fix: string;
}

interface FindingsListProps {
  findings: Finding[];
  className?: string;
}

const severityConfig = {
  low: {
    color: '#FFD93D',
    bg: 'rgba(255, 217, 61, 0.1)',
    border: 'rgba(255, 217, 61, 0.3)',
    icon: Info,
    label: 'Low'
  },
  medium: {
    color: '#FF9F43',
    bg: 'rgba(255, 159, 67, 0.1)',
    border: 'rgba(255, 159, 67, 0.3)',
    icon: AlertTriangle,
    label: 'Medium'
  },
  high: {
    color: '#FF4D6D',
    bg: 'rgba(255, 77, 109, 0.1)',
    border: 'rgba(255, 77, 109, 0.3)',
    icon: XCircle,
    label: 'High'
  }
};

export function FindingsList({ findings, className = '' }: FindingsListProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {findings.map((finding, idx) => {
        const config = severityConfig[finding.severity] || severityConfig.low;
        const Icon = config.icon;
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            <div 
              className="absolute inset-0 backdrop-blur-xl rounded-xl border"
              style={{ 
                backgroundColor: config.bg,
                borderColor: config.border
              }}
            />
            <div className="relative z-10 p-5">
              <div className="flex items-start gap-4 mb-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${config.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: config.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {finding.title}
                    </h4>
                    <span 
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{ 
                        backgroundColor: config.bg,
                        color: config.color,
                        border: `1px solid ${config.border}`
                      }}
                    >
                      {config.label}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {finding.whyItMatters}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                <div>
                  <span className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Location: 
                  </span>
                  <span className="text-white/80 text-sm ml-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {finding.whereInCode}
                  </span>
                </div>
                <div>
                  <span className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Fix: 
                  </span>
                  <span className="text-white/80 text-sm ml-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {finding.fix}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
