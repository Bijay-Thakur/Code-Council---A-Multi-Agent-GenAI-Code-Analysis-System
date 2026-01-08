import { motion } from 'framer-motion';
import { Sparkles, Code2, Brain, Zap } from 'lucide-react';

export function AnalysisLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl bg-black/60"
    >
      <div className="relative">
        {/* Outer glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: 'radial-gradient(circle, rgba(77, 255, 255, 0.3), transparent)',
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
          style={{
            background: 'radial-gradient(circle, rgba(154, 77, 255, 0.3), transparent)',
          }}
        />

        {/* Main card */}
        <div className="relative backdrop-blur-2xl bg-white/[0.08] rounded-3xl border border-white/20 p-12 shadow-2xl">
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              background: 'linear-gradient(45deg, #4DFFFF, #9A4DFF, #4DFFFF)',
              backgroundSize: '200% 200%',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="absolute inset-[2px] rounded-3xl backdrop-blur-2xl bg-black/40" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Rotating icons */}
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Code2 className="w-12 h-12 text-[#4DFFFF]" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Brain className="w-8 h-8 text-[#9A4DFF]" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Zap className="w-6 h-6 text-[#FFD93D]" fill="currentColor" />
              </motion.div>
            </div>

            {/* Pulsing sparkles */}
            <div className="relative w-full h-2 flex items-center justify-center gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, #4DFFFF, #9A4DFF)`,
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <motion.h3
                className="text-2xl text-white font-semibold"
                style={{ fontFamily: 'Inter, sans-serif' }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Analyzing Code...
              </motion.h3>
              <p className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Our AI agents are reviewing your code
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-64 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #4DFFFF, #9A4DFF)',
                }}
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: i % 2 === 0 ? '#4DFFFF' : '#9A4DFF',
              opacity: 0.6,
            }}
            animate={{
              x: [
                Math.cos((i * Math.PI * 2) / 6) * 100,
                Math.cos((i * Math.PI * 2) / 6) * 150,
                Math.cos((i * Math.PI * 2) / 6) * 100,
              ],
              y: [
                Math.sin((i * Math.PI * 2) / 6) * 100,
                Math.sin((i * Math.PI * 2) / 6) * 150,
                Math.sin((i * Math.PI * 2) / 6) * 100,
              ],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
