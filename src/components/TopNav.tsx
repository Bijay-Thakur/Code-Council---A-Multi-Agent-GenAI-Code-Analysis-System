import { motion } from 'framer-motion';

export function TopNav() {
  return (
    <nav className="relative border-b border-white/5">
      {/* Glass background */}
      <div className="absolute inset-0 backdrop-blur-xl bg-white/[0.02]" />
      
      <div className="relative z-10 flex items-center justify-between px-6 py-4">
        {/* Left: Project Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] blur-xl opacity-50" />
            <h1 
              className="relative text-3xl tracking-tight"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF]">
                Code Council
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Powered by pill */}
          <div className="px-5 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-[#4DFFFF]/10 to-[#9A4DFF]/10 border border-white/10">
            <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
              Powered by Multi-Agent GenAI
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
