import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';
import { TypingIndicator } from './TypingIndicator';
import { Message } from './Message';
import { API_BASE_URL } from '../config/api';

interface ChatInterfaceProps {
  onBack: () => void;
}

interface MessageType {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}



export function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'welcome-1',
      text: "Welcome to Code Council! I'm here to assist you with anything you need. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

// HANDLE SEND -> SEND USER MESSAGE TO BACKEND

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) {
      console.log('[frontend] Chat send blocked:', { hasInput: !!inputValue.trim(), isTyping });
      return;
    }

    console.log('[frontend] Sending chat message:', inputValue);
    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };
    
    // Add user message to UI immediately
    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Call backend API
    try {
      console.log('[frontend] Sending message to backend...');
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          history: messages
            .filter(msg => msg.id !== 'welcome-1') // Exclude welcome message from history
            .map((msg) => ({
              role: msg.isBot ? 'assistant' : 'user',
              content: msg.text,
            })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[frontend] Received response from backend');
      
      const botMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    } catch(error) {
      console.error('[frontend] Error:', error);

      const errorMessage: MessageType = {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      {/* Chat container with glassmorphism */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl h-[85vh] rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 backdrop-blur-md bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <motion.div 
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-black/40"
                  />
                </div>
                <div>
                  <h2 className="text-white tracking-wide">NEXUS AI</h2>
                  <p className="text-xs text-white/60">Always online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/10 backdrop-blur-md bg-white/5">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="w-full px-6 py-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-white/30 transition-all"
              />
            </div>
            
            <motion.button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              <Send className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}