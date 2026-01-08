import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'javascript', className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 backdrop-blur-xl bg-black/60 rounded-xl border border-white/10" />
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-white/10">
          <span className="text-white/60 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            {language}
          </span>
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Copied!
                </span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-white/80" />
                <span className="text-white/80 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Copy
                </span>
              </>
            )}
          </motion.button>
        </div>
        
        {/* Code */}
        <div className="p-4 overflow-x-auto">
          <pre 
            className="text-white/90 text-sm"
            style={{ 
              fontFamily: 'JetBrains Mono, Fira Code, monospace',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
