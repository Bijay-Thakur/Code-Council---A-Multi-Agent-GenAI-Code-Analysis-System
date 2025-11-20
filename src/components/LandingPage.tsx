import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onEnterChat: () => void;
}

export function LandingPage({ onEnterChat }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-7xl w-full">
        {/* Company tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 space-y-2"
        >
          <p 
            className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 uppercase tracking-[0.5em]"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.5em' }}
          >
            Redefining Human-AI Connection
          </p>
          <p 
            className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 uppercase tracking-[0.5em]"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', letterSpacing: '0.5em' }}
          >
            Experience Intelligence Beyond Limits
          </p>
        </motion.div>

        {/* Product name - HUGE and striking */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 relative"
        >
          {/* Glow effect behind text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-48 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-[100px]" />
          </div>

          <div className="relative">
            <h1 
              className="text-[14rem] leading-[0.85] tracking-tighter mb-0"
              style={{ 
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '900',
                WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
              }}
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-white">
                NEXUS
              </span>
            </h1>
            <h1 
              className="text-[16rem] leading-[0.85] tracking-tighter -mt-12"
              style={{ 
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontWeight: '900',
              }}
            >
              <span 
                className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                style={{
                  textShadow: '0 0 80px rgba(236, 72, 153, 0.5), 0 0 120px rgba(147, 51, 234, 0.3)'
                }}
              >
                AI
              </span>
            </h1>
          </div>

          {/* Subtitle badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-3 mt-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
            <div className="px-8 py-3 rounded-full backdrop-blur-xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-white/10">
              <p 
                className="text-white tracking-[0.3em] uppercase"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Next-Gen Intelligence
              </p>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mb-16"
        >
          <p 
            className="text-2xl text-white/70 max-w-2xl mx-auto"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            Ready to transform your conversations with cutting-edge AI?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400">
              Let's create something extraordinary together.
            </span>
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <motion.button
            onClick={onEnterChat}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-4 px-12 py-6 rounded-full overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative flex items-center gap-4">
              <Sparkles className="w-6 h-6 text-white" />
              <span 
                className="text-3xl text-white tracking-wider uppercase"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontWeight: '700' }}
              >
                Start Chatting
              </span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 blur-xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
            </div>
          </motion.button>

          {/* Hint text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="mt-6 text-white/40 tracking-wider uppercase text-sm"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            Click to begin your AI experience
          </motion.p>
        </motion.div>

        {/* Minimal floating elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? '#ec4899' : i % 3 === 1 ? '#8b5cf6' : '#3b82f6'
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
