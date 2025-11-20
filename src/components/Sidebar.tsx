import { Home, Code, Lightbulb, Bug, BarChart3, MessageSquare, CheckCircle, ScrollText, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { id: 'home', path: '/home', icon: Home, label: 'Home' },
  { id: 'code', path: '/code', icon: Code, label: 'Code Input' },
  { id: 'explainer', path: '/explainer', icon: Lightbulb, label: 'Explainer Agent' },
  { id: 'bug-hunter', path: '/bughunter', icon: Bug, label: 'Bug Hunter Agent' },
  { id: 'complexity', path: '/complexity', icon: BarChart3, label: 'Complexity Agent' },
  { id: 'debate', path: '/debate', icon: MessageSquare, label: 'Debate Panel' },
  { id: 'verdict', path: '/final', icon: CheckCircle, label: 'Final Verdict' },
  { id: 'logs', path: '/logs', icon: ScrollText, label: 'System Logs' },
  { id: 'about', path: '/about', icon: Info, label: 'About' },
];

export function Sidebar() {
  const location = useLocation();
  return (
    <aside className="w-72 border-r border-white/5 relative">
      {/* Glass background */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.02]" />
      
      {/* Content */}
      <div className="relative z-10 p-4 h-full overflow-y-auto">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.path}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl
                    backdrop-blur-xl border transition-all group
                    ${isActive 
                      ? 'bg-gradient-to-r from-[#4DFFFF]/20 to-[#9A4DFF]/20 border-[#4DFFFF]/50 shadow-lg shadow-[#4DFFFF]/10' 
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                    }
                  `}
                >
                {/* Icon with glow effect */}
                <div className={`
                  relative p-2 rounded-xl transition-all
                  ${isActive 
                    ? 'bg-gradient-to-br from-[#4DFFFF]/30 to-[#9A4DFF]/30' 
                    : 'bg-white/5 group-hover:bg-white/10'
                  }
                `}>
                  {isActive && (
                    <div className="absolute inset-0 bg-[#4DFFFF] blur-lg opacity-40" />
                  )}
                  <Icon 
                    className={`
                      relative w-5 h-5 transition-colors
                      ${isActive ? 'text-[#4DFFFF]' : 'text-white/60 group-hover:text-white/80'}
                    `}
                    strokeWidth={1.5}
                  />
                </div>

                {/* Label */}
                <span 
                  className={`
                    text-sm transition-colors
                    ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'}
                  `}
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: isActive ? '500' : '400' }}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-2 h-2 rounded-full bg-[#4DFFFF]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom accent */}
        <div className="mt-8 p-4 rounded-2xl backdrop-blur-xl bg-gradient-to-br from-[#4DFFFF]/10 to-[#9A4DFF]/10 border border-white/10">
          <p className="text-xs text-white/50 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            Multi-Agent System
          </p>
          <p className="text-xs text-white/70 text-center mt-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500' }}>
            v2.0.0
          </p>
        </div>
      </div>
    </aside>
  );
}
