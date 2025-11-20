import { useState } from 'react';
import { Play, Clock, FileCode, Hash } from 'lucide-react';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  isAnalyzing: boolean;
  onRunAnalysis: () => void;
}

export function CodeEditor({ isAnalyzing, onRunAnalysis }: CodeEditorProps) {
  const [code, setCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`);

  const lineCount = code.split('\n').length;

  return (
    <div className="relative">
      {/* Glass card */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-3xl border border-white/10" />
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#4DFFFF]/20 to-[#9A4DFF]/20">
              <FileCode className="w-5 h-5 text-[#4DFFFF]" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
              Code Input
            </h2>
          </div>

          <motion.button
            onClick={onRunAnalysis}
            disabled={isAnalyzing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity" />
            
            {/* Button */}
            <div className="relative flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] border border-white/20">
              <Play className="w-5 h-5 text-white" fill="white" />
              <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                {isAnalyzing ? 'Analyzing...' : 'Run Council Review'}
              </span>
            </div>
          </motion.button>
        </div>

        {/* Code editor area */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#4DFFFF]/5 to-[#9A4DFF]/5 pointer-events-none" />
          
          {/* Editor */}
          <div className="relative backdrop-blur-xl bg-black/40">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-[400px] p-6 bg-transparent text-white/90 resize-none outline-none"
              style={{ 
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                fontSize: '14px',
                lineHeight: '1.6'
              }}
              spellCheck={false}
            />
          </div>

          {/* Syntax highlighting overlay (decorative) */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4DFFFF]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#9A4DFF]/50 to-transparent" />
        </div>

        {/* Stats tray */}
        <div className="mt-4 flex items-center gap-4">
          {/* Language */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
            <Hash className="w-4 h-4 text-[#4DFFFF]" strokeWidth={2} />
            <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
              JavaScript
            </span>
          </div>

          {/* Lines of code */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
            <FileCode className="w-4 h-4 text-[#9A4DFF]" strokeWidth={2} />
            <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
              {lineCount} Lines
            </span>
          </div>

          {/* Last analyzed */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10">
            <Clock className="w-4 h-4 text-[#4DFFFF]" strokeWidth={2} />
            <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
              {isAnalyzing ? 'Analyzing now...' : 'Not analyzed yet'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
