

import { motion } from 'framer-motion';
import { Sparkles, Users, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Multi-Agent Intelligence',
    description: 'Powered by specialized AI agents working in harmony',
    color: '#4DFFFF'
  },
  {
    icon: Users,
    title: 'Collaborative Analysis',
    description: 'Agents debate and refine insights for optimal results',
    color: '#9A4DFF'
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Lightning-fast code analysis and recommendations',
    color: '#FFD93D'
  },
  {
    icon: Shield,
    title: 'Production Ready',
    description: 'Enterprise-grade reliability and accuracy',
    color: '#6BCF7F'
  },
];

export function About() {
  return (
    <div className="space-y-6">
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
        
        <div className="relative z-10 p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] blur-3xl opacity-50" />
              <h1 
                className="relative text-6xl tracking-tight"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: '700' }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF]">
                  Code Council
                </span>
              </h1>
            </div>

            <p 
              className="text-xl text-white/70 max-w-2xl mx-auto mb-8"
              style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
            >
              A revolutionary multi-agent GenAI system that analyzes code through collaborative intelligence.
              Experience the future of code review.
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="px-6 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10">
                <span className="text-sm text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Version 2.0.0
                </span>
              </div>
              <div className="px-6 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-[#4DFFFF]/20 to-[#9A4DFF]/20 border border-white/20">
                <span className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                  2026 Edition
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-2xl border border-white/10 group-hover:border-white/20 transition-all" />
              
              <div className="relative z-10 p-6">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div 
                      className="absolute inset-0 rounded-xl blur-xl opacity-40"
                      style={{ backgroundColor: feature.color }}
                    />
                    <div 
                      className="relative p-3 rounded-xl border"
                      style={{ 
                        backgroundColor: `${feature.color}20`,
                        borderColor: `${feature.color}40`
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: feature.color }} strokeWidth={2} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 
                      className="text-lg text-white mb-2"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
                    >
                      {feature.title}
                    </h3>
                    <p 
                      className="text-sm text-white/60"
                      style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tech stack */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-2xl border border-white/10" />
        
        <div className="relative z-10 p-6">
          <h3 
            className="text-lg text-white mb-4"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
          >
            Powered By
          </h3>
          
          <div className="flex flex-wrap gap-3">
            {['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'GPT-4', 'Multi-Agent AI'].map((tech, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 + 0.8, duration: 0.3 }}
                className="px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10"
              >
                <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {tech}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
