import { motion } from 'framer-motion';
import { AgentOutputCard } from './AgentOutputCard';

interface AgentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAnalyzing: boolean;
}

const tabs = [
  { id: 'explainer', label: 'Explainer', color: '#4DFFFF' },
  { id: 'bug-hunter', label: 'Bug Hunter', color: '#FF4D6D' },
  { id: 'complexity', label: 'Complexity', color: '#9A4DFF' },
  { id: 'debate', label: 'Debate', color: '#FFD93D' },
  { id: 'refined', label: 'Refined Answer', color: '#6BCF7F' },
];

export function AgentTabs({ activeTab, onTabChange, isAnalyzing }: AgentTabsProps) {
  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="relative">
        <div className="absolute inset-0 backdrop-blur-2xl bg-white/[0.03] rounded-2xl border border-white/10" />
        
        <div className="relative z-10 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative px-6 py-3 rounded-xl transition-all whitespace-nowrap"
                >
                  {/* Active background */}
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="activeTabBg"
                        className="absolute inset-0 backdrop-blur-xl bg-white/10 rounded-xl border border-white/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-xl blur-xl opacity-30"
                        style={{ backgroundColor: tab.color }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    </>
                  )}

                  {/* Tab content */}
                  <div className="relative flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: isActive ? tab.color : 'rgba(255,255,255,0.3)' }}
                    />
                    <span 
                      className={`text-sm transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: isActive ? '600' : '400' }}
                    >
                      {tab.label}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active tab content */}
      <AgentOutputCard 
        agentId={activeTab}
        agentName={tabs.find(t => t.id === activeTab)?.label || ''}
        agentColor={tabs.find(t => t.id === activeTab)?.color || '#4DFFFF'}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
}
