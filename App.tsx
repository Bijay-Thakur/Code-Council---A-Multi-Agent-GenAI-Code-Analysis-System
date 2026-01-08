import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AnalysisProvider } from './src/contexts/AnalysisContext';
import { TopNav } from './src/components/TopNav';
import { Sidebar } from './src/components/Sidebar';
import { FloatingChat } from './src/components/FloatingChat';
import { HomePage } from './src/pages/HomePage';
import { CodeInputPage } from './src/pages/CodeInputPage';
import { ExplainerAgentPage } from './src/pages/ExplainerAgentPage';
import { BugHunterAgentPage } from './src/pages/BugHunterAgentPage';
import { ComplexityAgentPage } from './src/pages/ComplexityAgentPage';
import { DebatePanelPage } from './src/pages/DebatePanelPage';
import { FinalVerdictPage } from './src/pages/FinalVerdictPage';
import { SystemLogsPage } from './src/pages/SystemLogsPage';
import { AboutPage } from './src/pages/AboutPage';
import { AgentsPage } from './src/pages/AgentsPage';

export default function App() {
  return (
    <ThemeProvider>
      <AnalysisProvider>
        <BrowserRouter>
        <div className="min-h-screen overflow-hidden relative transition-colors duration-300">
          {/* Animated gradient background - theme aware */}
          <div className="fixed inset-0 bg-gradient-to-br from-[#0A0F2C] via-[#111A44] to-[#0A0F2C] dark:from-[#0A0F2C] dark:via-[#111A44] dark:to-[#0A0F2C] light:from-[#F0F4F8] light:via-[#E8EDF3] light:to-[#F0F4F8] transition-colors duration-300">
            {/* Animated orbs */}
            <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-[#4DFFFF]/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-[#9A4DFF]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#4DFFFF]/5 rounded-full blur-[100px]" />
          </div>

          {/* Glass grid overlay */}
        <div 
          className="fixed inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(77, 255, 255, 0.3) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(77, 255, 255, 0.3) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Main content */}
        <div className="relative z-10 flex flex-col h-screen">
          <TopNav />
          
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-6 space-y-6">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/code" element={<CodeInputPage />} />
                <Route path="/explainer" element={<ExplainerAgentPage />} />
                <Route path="/bughunter" element={<BugHunterAgentPage />} />
                <Route path="/complexity" element={<ComplexityAgentPage />} />
                <Route path="/debate" element={<DebatePanelPage />} />
                <Route path="/final" element={<FinalVerdictPage />} />
                <Route path="/logs" element={<SystemLogsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/agents" element={<AgentsPage />} />
              </Routes>
            </main>
          </div>
        </div>

        <FloatingChat />
      </div>
        </BrowserRouter>
      </AnalysisProvider>
    </ThemeProvider>
  );
}
