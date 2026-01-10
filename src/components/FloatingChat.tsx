import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { useAnalysis } from '../contexts/AnalysisContext';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export function FloatingChat() {
  const { code, results } = useAnalysis();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      text: results && code ? 
        "Hello! I can help you understand the code analysis results, answer questions about your code, explain findings, or discuss the debate. What would you like to know?" :
        "Hello! I'm your Code Council assistant. I can help you understand the multi-agent analysis, explain results, or answer questions about your code.",
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async () => {
    if (!message.trim() || isTyping) {
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = message;
    setMessage('');
    setIsTyping(true);

    try {
      // Prepare context from analysis results
      const context = {
        hasCode: !!code && code.trim().length > 0,
        hasAnalysis: !!results,
        code: code ? code.substring(0, 2000) : null, // Limit code length for context
        explainer: results?.explainer ? {
          overview: results.explainer.overview,
          purpose: results.explainer.purpose,
          keyIdentifiers: results.explainer.keyIdentifiers || []
        } : null,
        bugHunter: results?.bugHunter ? {
          summary: results.bugHunter.summary,
          findingsCount: results.bugHunter.findings?.length || 0,
          findings: results.bugHunter.findings?.slice(0, 5) || [] // Limit to first 5 findings
        } : null,
        complexity: results?.complexity ? {
          timeComplexity: results.complexity.time?.bigO,
          spaceComplexity: results.complexity.space?.bigO,
          timeReasoning: results.complexity.time?.reasoning
        } : null,
        debate: results?.debate ? {
          topic: results.debate.topic,
          roundsCount: results.debate.rounds?.length || 0,
          consensus: results.debate.consensus
        } : null,
        finalVerdict: results?.finalVerdict ? {
          summary: results.finalVerdict.summary,
          riskLevel: results.finalVerdict.riskLevel,
          actionItems: results.finalVerdict.prioritizedActions?.slice(0, 5) || []
        } : null
      };

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          history: messages
            .filter(msg => msg.id !== 'welcome-1')
            .map((msg) => ({
              role: msg.isBot ? 'assistant' : 'user',
              content: msg.text,
            })),
          context: context, // Include analysis context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I'm sorry, I couldn't generate a response.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('[FloatingChat] Error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: "I'm sorry, something went wrong connecting to the AI backend.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.isBot ? '' : 'justify-end'}`}
                  >
                    {msg.isBot && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                          AI
                        </span>
                      </div>
                    )}
                    <div className={`flex-1 ${msg.isBot ? '' : 'max-w-[80%]'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl backdrop-blur-xl border ${
                          msg.isBot
                            ? 'rounded-tl-sm bg-white/10 border-white/10'
                            : 'rounded-tr-sm bg-gradient-to-r from-[#4DFFFF]/20 to-[#9A4DFF]/20 border-white/20 ml-auto'
                        }`}
                      >
                        <p className="text-sm text-white/90 whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                          {msg.text}
                        </p>
                      </div>
                    </div>
                    {!msg.isBot && (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                          U
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4DFFFF] to-[#9A4DFF] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '600' }}>
                        AI
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm backdrop-blur-xl bg-white/10 border border-white/10">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-[#4DFFFF]/50 transition-all"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                    />
                  </div>

                  <motion.button
                    onClick={handleSend}
                    disabled={!message.trim() || isTyping}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group disabled:opacity-50 disabled:cursor-not-allowed"
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
