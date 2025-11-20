# 🏛️ Code Council — Multi-Agent GenAI Code Analysis System

<div align="center">

**A next-generation GenAI system that leverages multiple specialized AI agents to analyze, debate, and refine code through collaborative intelligence.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**Code Council** represents the cutting edge of AI-powered code analysis systems. Unlike traditional single-agent code review tools, Code Council employs a sophisticated multi-agent architecture where specialized AI agents collaborate, debate, and refine their analysis through structured reasoning rounds.

The system operates on a fundamental principle: **collaborative intelligence produces superior results**. Each agent brings a unique perspective—from code explanation and bug detection to complexity analysis and critical debate. These agents don't work in isolation; they engage in multi-round debates, challenge each other's assumptions, and collectively arrive at a refined, comprehensive verdict.

Built with modern web technologies and a stunning glassmorphism UI, Code Council provides a dashboard-based interface that makes complex AI reasoning transparent and accessible. The system is fully API-driven, designed for scalability, and ready for production deployment. This project showcases advanced GenAI engineering skills, making it an ideal portfolio piece for AI engineering interviews and demonstrating expertise in multi-agent systems, prompt engineering, and modern full-stack development.

---

## 🚀 Features

### 🤖 Multi-Agent Reasoning System
- **Five Specialized Agents**: Each agent is fine-tuned for a specific aspect of code analysis
- **Parallel Processing**: Agents analyze code simultaneously for maximum efficiency
- **Collaborative Intelligence**: Agents share insights and build upon each other's findings

### 👥 Core Agents

- **🔍 Explainer Agent** — Simplifies complex code into clear, understandable explanations
- **🐛 Bug Hunter Agent** — Detects vulnerabilities, logic errors, and potential issues
- **📊 Complexity Analyst Agent** — Computes time/space complexity and performance metrics
- **💬 Debate Agent** — Challenges assumptions through structured argument/counterargument rounds
- **👑 Supervisor Agent** — Synthesizes all agent outputs into a final refined verdict

### 💻 Code Editor & Analysis
- **Real-time Code Input** — Paste or write code directly in the browser
- **Instant Analysis** — Trigger multi-agent analysis with a single click
- **Syntax Highlighting** — Beautiful code editor with language detection

### 🎭 Multi-Round Debate Panel
- **Structured Debates** — Watch agents challenge and refine each other's analysis
- **Round-by-Round View** — See how consensus emerges through debate
- **Consensus Tracking** — Visual indicators show when agents reach agreement

### 📋 Final Verdict Synthesis
- **Merged Analysis** — Supervisor agent combines all insights into a comprehensive report
- **Actionable Recommendations** — Clear, prioritized suggestions for code improvement
- **Refined Solutions** — Optimized code examples based on collective analysis

### 📊 System Logs
- **Real-time Activity** — Track agent actions and system events
- **Timestamped Events** — Complete audit trail of the analysis process
- **Status Indicators** — Visual feedback for agent completion and system health

### 💬 Floating AI Chat Assistant
- **Context-Aware Support** — Get help about the analysis process
- **Agent Information** — Learn about each agent's role and capabilities
- **Interactive Guidance** — Chat interface for exploring Code Council features

### 🎨 Glassmorphism Dashboard UI
- **Modern Design** — Beautiful glass-effect panels with backdrop blur
- **Neon Gradients** — Vibrant color schemes for each agent
- **Smooth Animations** — Fluid transitions and hover effects
- **Responsive Layout** — Optimized for desktop, tablet, and mobile devices
- **Dark/Light Theme** — Toggle between themes with smooth transitions

---

## 🧠 Multi-Agent Architecture

Code Council employs a sophisticated orchestration pattern where a central **Orchestrator** coordinates multiple specialized agents. Here's how the system works:

```
┌─────────────────────────────────────────────────────────────┐
│                    User Code Input                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Orchestrator   │
              │  (Coordinator)  │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Explainer  │ │ Bug Hunter  │ │ Complexity │
│   Agent     │ │   Agent     │ │   Agent    │
└──────┬──────┘ └──────┬──────┘ └──────┬─────┘
       │               │                │
       └───────────────┼────────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │  Debate Agent   │
              │  (Multi-Round)  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Supervisor Agent│
              │  (Final Merge)  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   UI Output      │
              │  (Dashboard)     │
              └─────────────────┘
```

### Message Flow

1. **User Input** → User submits code through the Code Editor interface
2. **Orchestrator Dispatch** → Central coordinator sends code to all specialized agents simultaneously
3. **Parallel Analysis** → Agents evaluate code independently:
   - **Explainer Agent** → Generates code explanations
   - **Bug Hunter Agent** → Identifies issues and vulnerabilities
   - **Complexity Analyst** → Computes performance metrics
4. **Debate Rounds** → Debate Agent facilitates structured argument/counterargument sessions
5. **Supervisor Synthesis** → Supervisor Agent merges all outputs into final verdict
6. **UI Updates** → Dashboard displays results across multiple views:
   - Code Input page with analysis results
   - Debate Panel with round-by-round discussions
   - Final Verdict with merged recommendations
   - System Logs with activity timeline

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework for component-based architecture |
| **TypeScript** | 5.6.3 | Type-safe JavaScript for robust development |
| **TailwindCSS** | 3.4.14 | Utility-first CSS framework for rapid styling |
| **Vite** | 5.4.11 | Lightning-fast build tool and dev server |
| **React Router** | 7.9.6 | Client-side routing for multi-page navigation |
| **Framer Motion** | 11.11.17 | Production-ready motion library for animations |
| **Lucide React** | 0.468.0 | Beautiful, customizable icon library |

### Backend (Planned Integration)

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment for server-side logic |
| **Express** | Web framework for API endpoints |
| **OpenAI GPT-4o-mini** | Primary LLM for agent reasoning |
| **OpenAI GPT-4.1** | Advanced model for Supervisor Agent |
| **Multi-agent Routing** | Custom orchestration logic for agent coordination |
| **Rate Limiting** | Exponential backoff and request throttling |

### Development Tools

- **Cursor / GitHub Copilot** — AI-powered code completion
- **ESLint** — Code quality and consistency
- **PostCSS** — CSS processing and optimization
- **Autoprefixer** — Automatic vendor prefixing

---

## 📂 Project Structure

```
Code_Council/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── About.tsx
│   │   ├── AgentOutputCard.tsx
│   │   ├── AgentTabs.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── DebatePanel.tsx
│   │   ├── FloatingChat.tsx
│   │   ├── Message.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SystemLogs.tsx
│   │   ├── TopNav.tsx
│   │   └── TypingIndicator.tsx
│   │
│   ├── pages/               # Route-based page components
│   │   ├── AboutPage.tsx
│   │   ├── AgentsPage.tsx
│   │   ├── BugHunterAgentPage.tsx
│   │   ├── CodeInputPage.tsx
│   │   ├── ComplexityAgentPage.tsx
│   │   ├── DebatePanelPage.tsx
│   │   ├── ExplainerAgentPage.tsx
│   │   ├── FinalVerdictPage.tsx
│   │   ├── HomePage.tsx
│   │   └── SystemLogsPage.tsx
│   │
│   ├── contexts/            # React context providers
│   │   └── ThemeContext.tsx
│   │
│   └── styles/              # Global styles
│       └── globals.css
│
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # TailwindCSS configuration
└── postcss.config.js        # PostCSS configuration
```

---

## ⚙️ How It Works

### User Journey

1. **Code Submission**
   - User navigates to the Code Input page
   - Pastes or writes code in the integrated code editor
   - Selects programming language (auto-detected)

2. **Analysis Trigger**
   - User clicks "Run Council Review" button
   - Frontend sends code to backend `/analyze` endpoint
   - Loading states activate across the dashboard

3. **Agent Orchestration**
   - Orchestrator receives code and dispatches to agents
   - Four agents analyze in parallel:
     - Explainer generates explanations
     - Bug Hunter identifies issues
     - Complexity Analyst computes metrics
     - Debate Agent prepares arguments

4. **Debate Rounds**
   - Debate Agent facilitates structured discussions
   - Agents challenge each other's findings
   - Multiple rounds refine the analysis

5. **Final Synthesis**
   - Supervisor Agent merges all agent outputs
   - Creates prioritized recommendations
   - Generates optimized code suggestions

6. **UI Updates**
   - Code Input page shows individual agent results
   - Debate Panel displays round-by-round discussions
   - Final Verdict page presents merged analysis
   - System Logs update with activity timeline

### Technical Flow

```
Frontend (React)          Backend (Node.js/Express)        OpenAI API
     │                            │                           │
     │── POST /analyze ──────────>│                           │
     │                            │── Agent 1 Request ───────>│
     │                            │── Agent 2 Request ───────>│
     │                            │── Agent 3 Request ───────>│
     │                            │── Agent 4 Request ───────>│
     │                            │<── Agent 1 Response ──────│
     │                            │<── Agent 2 Response ──────│
     │                            │<── Agent 3 Response ──────│
     │                            │<── Agent 4 Response ──────│
     │                            │── Debate Round 1 ────────>│
     │                            │<── Debate Response ───────│
     │                            │── Supervisor Merge ──────>│
     │                            │<── Final Verdict ─────────│
     │<── Analysis Results ───────│                           │
     │                            │                           │
```

---

## 🌐 API Endpoints (Planned Backend)

### Core Analysis

#### `POST /analyze`
Main entry point for code analysis. Orchestrates the entire multi-agent process.

**Request:**
```json
{
  "code": "function fibonacci(n) { ... }",
  "language": "javascript",
  "options": {
    "includeDebate": true,
    "rounds": 3
  }
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "status": "completed",
  "results": {
    "explainer": { ... },
    "bugHunter": { ... },
    "complexity": { ... },
    "debate": { ... },
    "final": { ... }
  },
  "timestamp": "2025-01-20T00:00:00Z"
}
```

### Individual Agent Endpoints

#### `POST /agent/explainer`
Generates code explanations and simplifies complex logic.

**Request:**
```json
{
  "code": "string",
  "language": "string"
}
```

**Response:**
```json
{
  "explanation": "string",
  "complexity": "low|medium|high",
  "keyConcepts": ["array", "string"]
}
```

#### `POST /agent/bughunter`
Detects bugs, vulnerabilities, and logic issues.

**Request:**
```json
{
  "code": "string",
  "language": "string"
}
```

**Response:**
```json
{
  "issues": [
    {
      "severity": "critical|high|medium|low",
      "type": "bug|vulnerability|logic",
      "description": "string",
      "line": 5,
      "suggestion": "string"
    }
  ],
  "summary": "string"
}
```

#### `POST /agent/complexity`
Computes time and space complexity metrics.

**Request:**
```json
{
  "code": "string",
  "language": "string"
}
```

**Response:**
```json
{
  "timeComplexity": "O(n)",
  "spaceComplexity": "O(1)",
  "metrics": {
    "linesOfCode": 10,
    "cyclomaticComplexity": 3,
    "functionCount": 2
  },
  "recommendations": ["string"]
}
```

#### `POST /agent/debate`
Facilitates multi-round debate between agents.

**Request:**
```json
{
  "agentOutputs": {
    "explainer": { ... },
    "bugHunter": { ... },
    "complexity": { ... }
  },
  "rounds": 3
}
```

**Response:**
```json
{
  "rounds": [
    {
      "round": 1,
      "agent": "explainer",
      "argument": "string",
      "counterArgument": "string"
    }
  ],
  "consensus": "string"
}
```

#### `POST /agent/final`
Synthesizes all agent outputs into final verdict.

**Request:**
```json
{
  "sessionId": "uuid",
  "agentOutputs": {
    "explainer": { ... },
    "bugHunter": { ... },
    "complexity": { ... },
    "debate": { ... }
  }
}
```

**Response:**
```json
{
  "verdict": "string",
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "performance|security|readability",
      "description": "string",
      "suggestedCode": "string"
    }
  ],
  "score": 85,
  "summary": "string"
}
```

---

## 🖼️ Screenshots

![Home Page](./screenshots/home.png)
*Welcome screen with glassmorphism design and feature overview*

![Code Editor](./screenshots/editor.png)
*Code input interface with real-time analysis and agent tabs*

![Debate Panel](./screenshots/debate.png)
*Multi-round debate visualization showing agent interactions*

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **OpenAI API Key** (for backend integration)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/Code_Council.git

# Navigate to project directory
cd Code_Council

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI API Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Backend API URL (for production)
VITE_BACKEND_URL=http://localhost:3000

# Optional: Environment
VITE_ENV=development
```

**⚠️ Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

---

## 🎨 Design Principles

### Glassmorphism
- **Backdrop Blur**: Translucent panels with blur effects create depth
- **Transparency**: Layered glass effects for modern aesthetic
- **Border Gradients**: Subtle colored borders define agent identity

### Neon Gradients
- **Agent Colors**: Each agent has a unique neon color scheme
  - Explainer: Cyan (`#4DFFFF`)
  - Bug Hunter: Red (`#FF4D6D`)
  - Complexity: Purple (`#9A4DFF`)
  - Debate: Yellow (`#FFD93D`)
  - Supervisor: Green (`#6BCF7F`)

### Minimalistic Layout
- **Clean Spacing**: Generous whitespace for readability
- **Focused Content**: Each page has a single, clear purpose
- **Visual Hierarchy**: Size, color, and position guide user attention

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Breakpoints**: TailwindCSS responsive utilities
- **Flexible Grids**: 3 columns (desktop) → 2 (tablet) → 1 (mobile)

### Particle Effects
- **Animated Backgrounds**: Subtle particle fields add dynamism
- **Gradient Orbs**: Pulsing light orbs create atmosphere
- **Grid Overlays**: Subtle grid patterns enhance depth

### Smooth Animations
- **Framer Motion**: Production-ready animations
- **Hover Effects**: Interactive feedback on all clickable elements
- **Page Transitions**: Smooth navigation between routes
- **Loading States**: Elegant loading indicators

---

## 🌟 Why This Project Matters

### Portfolio Showcase

Code Council demonstrates **real GenAI engineering skills** that employers actively seek:

1. **Multi-Agent System Design** — Shows understanding of complex AI architectures
2. **Prompt Engineering** — Demonstrates ability to craft effective LLM prompts
3. **Full-Stack Development** — Modern React frontend with scalable backend architecture
4. **API Design** — RESTful endpoints with clear request/response patterns
5. **UI/UX Excellence** — Beautiful, functional interface that users actually want to use

### Interview Advantages

- **Technical Depth**: Discuss orchestration patterns, agent coordination, and LLM integration
- **Problem-Solving**: Explain how multi-agent debate improves code analysis quality
- **Production Readiness**: Show understanding of rate limiting, error handling, and scalability
- **Modern Stack**: Demonstrate proficiency with React, TypeScript, and modern tooling

### What Employers Learn

This project reveals:
- **Architecture Skills**: Can design and implement complex distributed systems
- **AI Engineering**: Understands LLM capabilities, limitations, and best practices
- **Code Quality**: Writes maintainable, type-safe, well-documented code
- **User Focus**: Builds interfaces that are both beautiful and functional

---

## 🏗️ Roadmap

### Phase 1: Backend Integration (Current)
- [ ] Full Node.js/Express backend implementation
- [ ] OpenAI API integration with all agents
- [ ] Multi-agent orchestration logic
- [ ] Rate limiting and exponential backoff
- [ ] Error handling and retry mechanisms

### Phase 2: Enhanced Features
- [ ] Persistent memory per session
- [ ] User authentication and session management
- [ ] Code history and version tracking
- [ ] Export analysis reports (PDF, Markdown)

### Phase 3: Advanced Agents
- [ ] Code optimization suggestion agent
- [ ] Test case generator agent
- [ ] Documentation generator agent
- [ ] Security vulnerability scanner agent

### Phase 4: Interactive Features
- [ ] Voice-enabled agent interactions
- [ ] Real-time collaborative editing
- [ ] Agent performance metrics dashboard
- [ ] Custom agent configuration

### Phase 5: Enterprise Features
- [ ] Model switching (GPT-4, Claude, Gemini)
- [ ] Custom fine-tuned models
- [ ] Team workspaces and sharing
- [ ] API rate limit management
- [ ] Webhook integrations

---

## 🤝 Contributions

Contributions, issues, and feature requests are welcome! 

Feel free to check the [issues page](https://github.com/yourusername/Code_Council/issues) or open a pull request.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ using React, TypeScript, and OpenAI**

[⭐ Star this repo](https://github.com/yourusername/Code_Council) | [🐛 Report Bug](https://github.com/yourusername/Code_Council/issues) | [💡 Request Feature](https://github.com/yourusername/Code_Council/issues)

</div>

