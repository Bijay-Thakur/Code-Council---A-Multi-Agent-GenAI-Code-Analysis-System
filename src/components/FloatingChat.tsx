import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic } from 'lucide-react';

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50"
      >
        {/* Glow rings */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] blur-xl"
        />
        
        {/* Button */}
        <div className="relative p-5 rounded-full backdrop-blur-2xl bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] border border-white/20 shadow-2xl">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6 text-white" strokeWidth={2.5} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-28 right-8 w-96 z-50"
          >
            {/* Glass panel */}
            <div className="absolute inset-0 backdrop-blur-2xl bg-black/40 rounded-3xl border border-white/10 shadow-2xl" />
            
            <div className="relative z-10 p-6 h-[500px] flex flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] rounded-full blur-lg opacity-50" />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] flex items-center justify-center">
                    <span className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                      AI
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                    Council Assistant
                  </h3>
                  <p className="text-sm text-white/60" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Ask me anything
                  </p>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 py-4 space-y-4 overflow-y-auto">
                {/* AI message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                      AI
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur-xl bg-white/10 border border-white/10">
                      <p className="text-sm text-white/90" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                        Hello! I'm your Code Council assistant. I can help you understand the multi-agent analysis, explain results, or answer questions about your code.
                      </p>
                    </div>
                  </div>
                </div>

                {/* User message example */}
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 max-w-[80%]">
                    <div className="px-4 py-3 rounded-2xl rounded-tr-sm backdrop-blur-xl bg-gradient-to-r from-[#4DFFFF]/20 to-[#9A4DFF]/20 border border-white/20 ml-auto">
                      <p className="text-sm text-white/90" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                        What's the best way to optimize recursive functions?
                      </p>
                    </div>
                  </div>
                </div>

                {/* AI response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                      AI
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur-xl bg-white/10 border border-white/10">
                      <p className="text-sm text-white/90" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                        Great question! The main techniques are:
                        <br />• Memoization (caching results)
                        <br />• Dynamic programming
                        <br />• Tail call optimization
                        <br />• Converting to iterative approach
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input area */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#4DFFFF]/50 transition-all"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#4DFFFF]/50 transition-all group"
                  >
                    <Mic className="w-5 h-5 text-white/70 group-hover:text-[#4DFFFF] transition-colors" strokeWidth={2} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="relative p-3 rounded-xl bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] border border-white/20">
                      <Send className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
