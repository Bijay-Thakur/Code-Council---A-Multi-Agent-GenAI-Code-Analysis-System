import { useState, useRef, useEffect } from 'react';
import { Settings, Moon, Sun, X, RefreshCw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close settings when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }

    if (isSettingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

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

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-4">
          {/* API Status */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/5 border border-white/10"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-green-400"
            />
            <span className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
              API Online
            </span>
          </motion.div>

          {/* Powered by pill */}
          <div className="px-5 py-2 rounded-full backdrop-blur-xl bg-gradient-to-r from-[#4DFFFF]/10 to-[#9A4DFF]/10 border border-white/10">
            <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
              Powered by Multi-Agent GenAI
            </span>
          </div>

          {/* Icon buttons */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#4DFFFF]/50 transition-all group"
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-white/70 group-hover:text-[#4DFFFF] transition-colors" />
              ) : (
                <Moon className="w-5 h-5 text-white/70 group-hover:text-[#4DFFFF] transition-colors" />
              )}
            </motion.button>

            {/* Settings Button */}
            <div className="relative" ref={settingsRef}>
              <motion.button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 hover:border-[#4DFFFF]/50 transition-all group"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-white/70 group-hover:text-[#4DFFFF] transition-colors" />
              </motion.button>

              {/* Settings Popover */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 z-50"
                  >
                    {/* Glass card */}
                    <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.08] rounded-2xl border border-white/20 shadow-2xl" />
                    
                    <div className="relative z-10 p-4 space-y-3">
                      {/* API Status */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                          API Status
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-sm text-green-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Online
                          </span>
                        </div>
                      </div>

                      {/* App Version */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Version
                        </span>
                        <span className="text-sm text-white/80" style={{ fontFamily: 'Inter, sans-serif' }}>
                          v2.0.0
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/10" />

                      {/* About Link */}
                      <motion.button
                        onClick={() => {
                          navigate('/about');
                          setIsSettingsOpen(false);
                        }}
                        whileHover={{ x: 4 }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <Info className="w-4 h-4 text-white/60 group-hover:text-[#4DFFFF] transition-colors" />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          About Code Council
                        </span>
                      </motion.button>

                      {/* Reload Agents Button */}
                      <motion.button
                        onClick={() => {
                          // Placeholder functionality
                          console.log('Reload agents');
                          setIsSettingsOpen(false);
                        }}
                        whileHover={{ x: 4 }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors group"
                      >
                        <RefreshCw className="w-4 h-4 text-white/60 group-hover:text-[#4DFFFF] transition-colors" />
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Reload Agents
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
