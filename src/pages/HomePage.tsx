import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Users, Bug, BarChart3, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Users,
    title: 'Multi-Agent Intelligence',
    description: 'Specialized AI agents collaborate to provide comprehensive code analysis',
    color: '#4DFFFF'
  },
  {
    icon: Bug,
    title: 'Bug Detection & Analysis',
    description: 'Advanced pattern recognition identifies potential issues and vulnerabilities',
    color: '#FF4D6D'
  },
  {
    icon: BarChart3,
    title: 'Complexity Evaluation',
    description: 'Deep analysis of time and space complexity with optimization recommendations',
    color: '#9A4DFF'
  },
  {
    icon: MessageSquare,
    title: 'Debate & Refinement Engine',
    description: 'Agents debate and refine insights to deliver the most accurate results',
    color: '#FFD93D'
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      {/* Particle field background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#4DFFFF]/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="text-center max-w-7xl w-full relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          {/* Title */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-32 bg-gradient-to-r from-[#4DFFFF]/20 via-[#9A4DFF]/20 to-[#4DFFFF]/20 blur-[80px]" />
            </div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative text-7xl md:text-8xl lg:text-9xl tracking-tight mb-4"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '700' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DFFFF] via-[#9A4DFF] to-[#4DFFFF]">
                Code Council
              </span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-6"
            style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}
          >
            A multi-agent GenAI system for advanced code reasoning, analysis, and debate.
          </motion.p>

          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#4DFFFF] to-transparent" />
            <div className="px-6 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-[#4DFFFF]/10 to-[#9A4DFF]/10 border border-white/10">
              <p className="text-sm text-white/80 tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
                Explain • Analyze • Debate • Improve
              </p>
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-[#9A4DFF] to-transparent" />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <motion.button
              onClick={() => navigate('/code')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl overflow-hidden"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
              
              {/* Button */}
              <div className="relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] border border-white/20">
                <Sparkles className="w-5 h-5 text-white" />
                <span className="text-lg text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                  Start Code Analysis
                </span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate('/agents')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#4DFFFF]/50 transition-all"
            >
              <Users className="w-5 h-5 text-white/70 group-hover:text-[#4DFFFF] transition-colors" />
              <span className="text-lg text-white/80 group-hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
                Meet the Agents
              </span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mt-20"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + idx * 0.1, duration: 0.5 }}
                className="relative group"
              >
                {/* Glass card */}
                <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-2xl border border-white/10 group-hover:border-white/20 transition-all" />
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
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

                    {/* Content */}
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
        </motion.div>
      </div>
    </div>
  );
}
