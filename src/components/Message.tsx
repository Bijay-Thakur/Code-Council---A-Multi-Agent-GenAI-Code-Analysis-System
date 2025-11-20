import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MessageProps {
  message: {
    id: string;
    text: string;
    isBot: boolean;
    timestamp: Date;
  };
}

export function Message({ message }: MessageProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(!message.isBot);

  useEffect(() => {
    if (!message.isBot) {
      setDisplayedText(message.text);
      setIsTypingComplete(true);
      return;
    }

    // Typing animation for bot messages
    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    const typingInterval = setInterval(() => {
      if (currentIndex <= message.text.length) {
        setDisplayedText(message.text.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [message.text, message.isBot]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
    >
      {message.isBot && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center"
        >
          <Bot className="w-5 h-5 text-white" />
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className={`max-w-[70%] px-5 py-3 rounded-2xl backdrop-blur-xl border ${
          message.isBot
            ? 'bg-white/10 border-white/20 rounded-tl-sm'
            : 'bg-gradient-to-r from-pink-500/30 to-purple-500/30 border-white/30 rounded-tr-sm'
        }`}
      >
        <p className="text-white/95 whitespace-pre-wrap break-words">
          {displayedText}
          {!isTypingComplete && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1 h-4 ml-1 bg-white/80"
            />
          )}
        </p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: isTypingComplete ? 0.5 : 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-white/50 mt-1"
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.p>
      </motion.div>

      {!message.isBot && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center"
        >
          <User className="w-5 h-5 text-white" />
        </motion.div>
      )}
    </motion.div>
  );
}