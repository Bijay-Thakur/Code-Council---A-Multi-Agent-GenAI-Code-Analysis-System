# 🏛️ Code Council — Multi-Agent GenAI Code Analysis System

<div align="center">

**A next-generation GenAI system that leverages multiple specialized AI agents to analyze, debate, and refine code through collaborative intelligence.**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.11-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.14-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express)](https://expressjs.com/)

</div>

---

## 📖 Overview

**Code Council** represents the cutting edge of AI-powered code analysis systems. Unlike traditional single-agent code review tools, Code Council employs a sophisticated multi-agent architecture where specialized AI agents collaborate, debate, and refine their analysis through structured reasoning rounds.

The system operates on a fundamental principle: **collaborative intelligence produces superior results**. Each agent brings a unique perspective—from code explanation and bug detection to complexity analysis and critical debate. These agents don't work in isolation; they engage in multi-round debates, challenge each other's assumptions, and collectively arrive at a refined, comprehensive verdict.

Built with modern web technologies and a stunning glassmorphism UI, Code Council provides a dashboard-based interface that makes complex AI reasoning transparent and accessible. The system is fully API-driven, designed for scalability, and ready for production deployment. This project showcases advanced GenAI engineering skills, making it an ideal portfolio piece for AI engineering interviews and demonstrating expertise in multi-agent systems, prompt engineering, and modern full-stack development.

---

## 🚀 Features

### 🤖 Multi-Agent Reasoning System
- **Six Specialized Agents**: Each agent is fine-tuned for a specific aspect of code analysis
- **Parallel Processing**: Explainer, BugHunter, and Complexity agents analyze code simultaneously
- **Collaborative Intelligence**: Agents share insights and build upon each other's findings through structured debate

### 👥 Core Agents

- **🗺️ Orchestrator Agent** — Creates an analysis plan and determines routing for all downstream agents
- **🔍 Explainer Agent** — Simplifies complex code into clear, understandable explanations with block-by-block breakdowns
- **🐛 Bug Hunter Agent** — Detects vulnerabilities, logic errors, and potential issues with severity ratings
- **📊 Complexity Analyst Agent** — Computes time/space complexity (Big-O) and performance metrics
- **💬 Debate Agent** — Facilitates 5+ structured argument/counterargument rounds between agents, concluding with a judge consensus
- **👑 Supervisor Agent** — Synthesizes all agent outputs into a final refined verdict with optimized code

### 💻 Code Editor & Analysis
- **Real-time Code Input** — Paste or write code directly in the browser
- **Instant Analysis** — Trigger multi-agent analysis with a single click
- **Syntax Highlighting** — Beautiful code editor with language detection

### 🎭 Multi-Round Debate Panel
- **Structured Debates** — Watch agents challenge and refine each other's analysis (minimum 5 rounds)
- **Round-by-Round View** — See how consensus emerges through debate
- **Judge Verdict** — Dedicated judge consensus with `isProductionReady`, `topPriorities`, and `rationale`

### 📋 Final Verdict Synthesis
- **Merged Analysis** — Supervisor agent combines all insights into a comprehensive report
- **Risk Level Assessment** — Clear `low | medium | high` risk classification
- **Actionable Recommendations** — Prioritized suggestions with optimized code output

### 📊 System Logs
- **Real-time Activity** — Track agent actions and system events with timestamps
- **Trace IDs** — Every analysis request is assigned a unique trace ID for debugging
- **Status Indicators** — Visual feedback for agent completion and system health

### 💬 Context-Aware AI Chat Assistant
- **Analysis Context** — Chat assistant is aware of the current code and all agent results
- **Dynamic System Prompt** — Incorporates explainer output, bug findings, complexity data, debate consensus, and final verdict
- **Conversation History** — Maintains multi-turn dialogue within a session

### 🎨 Glassmorphism Dashboard UI
- **Modern Design** — Beautiful glass-effect panels with backdrop blur
- **Neon Gradients** — Vibrant color schemes for each agent
- **Smooth Animations** — Fluid transitions and hover effects powered by Framer Motion
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
              │  (Plan + Route) │
              └────────┬────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Explainer  │ │ Bug Hunter  │ │ Complexity  │
│   Agent     │ │   Agent     │ │   Agent     │
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │                │
       └───────────────┼────────────────┘
                       │  (parallel → sequential)
                       ▼
              ┌─────────────────┐
              │  Debate Agent   │
              │  (5+ Rounds)    │
              │  + Judge Verdict│
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │ Supervisor Agent│
              │ (Final Verdict) │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   UI Output     │
              │  (Dashboard)    │
              └─────────────────┘
```

### Message Flow

1. **User Input** → User submits code through the Code Editor interface
2. **Orchestrator Dispatch** → Creates analysis plan; dispatches code to all specialized agents
3. **Parallel Analysis** → Three agents evaluate code simultaneously via `Promise.all`:
   - **Explainer Agent** → Teaching-style explanation with block-by-block breakdown
   - **Bug Hunter Agent** → Identifies issues with severity, evidence, and fix suggestions
   - **Complexity Analyst** → Computes Big-O time/space complexity and hotspots
4. **Debate Rounds** → Debate Agent facilitates 5+ structured argument/counterargument rounds, then generates a judge consensus
5. **Supervisor Synthesis** → Supervisor Agent merges all outputs into final verdict with optimized code
6. **UI Updates** → Dashboard displays results across multiple views:
   - Code Input page with individual agent results
   - Debate Panel with round-by-round discussions
   - Final Verdict with merged recommendations
   - System Logs with full activity timeline and trace ID

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

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment for server-side logic |
| **Express** | 5.1.0 | Web framework for API endpoints |
| **OpenAI SDK** | 6.9.1 | OpenAI API client for gpt-4o and gpt-4o-mini |
| **Google Generative AI** | 0.24.1 | Gemini API client (scaffolded for future use) |
| **Zod** | 4.3.5 | Schema validation with soft-validation strategy |
| **dotenv** | 17.2.3 | Environment variable management |
| **cors** | 2.8.5 | Cross-origin resource sharing middleware |
| **nodemon** | 3.1.11 | Auto-reload development server |

### AI Models

| Agent | Primary Model | Fallback |
|-------|--------------|---------|
| Orchestrator | gpt-4o-mini | stub response |
| Explainer | gpt-4o-mini | stub response |
| Bug Hunter | gpt-4o-mini | stub response |
| Complexity | gpt-4o-mini (temp 0.2) | stub response |
| Debate | gpt-4o | gpt-4o-mini |
| Supervisor | gpt-4o-mini | stub response |

### Development Tools

- **ESLint** — Code quality and consistency
- **PostCSS** — CSS processing and optimization
- **Autoprefixer** — Automatic vendor prefixing
- **concurrently** — Run frontend and backend simultaneously
- **wait-on** — Wait for backend health check before starting frontend

---

## 📂 Project Structure

```
Code_Council/
├── backend/
│   ├── server.js                # Express server entry point (port 3000)
│   ├── package.json             # Backend dependencies and scripts
│   ├── nodemon.json             # Nodemon auto-reload configuration
│   ├── .env                     # API keys (not committed)
│   ├── config/
│   │   └── agentModels.js       # Agent-to-model mapping configuration
│   ├── controllers/
│   │   ├── analyzeController.js # Multi-agent orchestration pipeline
│   │   └── chatController.js    # Context-aware chat handler
│   ├── routes/
│   │   ├── analyze.js           # POST /api/analyze route
│   │   └── chat.js              # POST /api/chat route
│   ├── services/
│   │   └── debateService.js     # 5+ round structured debate logic
│   ├── prompts/
│   │   └── agents.js            # Prompt templates for all 6 agents
│   ├── schemas/
│   │   └── agentSchemas.js      # Zod schemas with soft validation + fallback creators
│   ├── utils/
│   │   ├── openaiClient.js      # OpenAI API wrapper
│   │   ├── geminiClient.js      # Google Gemini API wrapper (scaffolded)
│   │   ├── modelHelper.js       # Agent config lookup utility
│   │   └── jsonParse.js         # Tolerant JSON parser (6 extraction strategies)
│   └── types/
│       └── analysisTypes.js     # JSDoc type definitions
│
├── src/
│   ├── components/              # Reusable UI components
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
│   ├── pages/                   # Route-based page components
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
│   ├── config/
│   │   └── api.ts               # API base URL configuration (points to :3000)
│   │
│   ├── contexts/                # React context providers
│   │   └── ThemeContext.tsx
│   │
│   └── styles/                  # Global styles
│       └── globals.css
│
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
├── index.html                   # HTML template
├── package.json                 # Root dependencies and dev scripts
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite build configuration
├── tailwind.config.js           # TailwindCSS configuration
└── postcss.config.js            # PostCSS configuration
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
   - Frontend sends code to backend `POST /api/analyze`
   - A unique trace ID is assigned to the request
   - Loading states activate across the dashboard

3. **Agent Orchestration**
   - Orchestrator creates analysis plan and routing
   - Three agents analyze code in parallel via `Promise.all`:
     - Explainer generates teaching-style breakdown with block-by-block analysis
     - Bug Hunter identifies issues with severity, evidence, impact, and fix
     - Complexity Analyst computes Big-O time/space and identifies hotspots

4. **Debate Rounds**
   - Debate Agent facilitates 5+ structured rounds:
     - Round 1: Explainer opens with a claim
     - Round 2: Bug Hunter rebuts
     - Round 3: Complexity Agent counters
     - Round 4: Explainer responds
     - Round 5: Bug Hunter closes
     - (Round 6+: Additional rounds as needed)
   - Judge generates consensus with `isProductionReady`, `topPriorities`, and `rationale`

5. **Final Synthesis**
   - Supervisor Agent merges all agent outputs
   - Assigns a risk level (`low | medium | high`)
   - Generates prioritized actions and optimized code

6. **UI Updates**
   - Code Input page shows individual agent results via tabbed interface
   - Debate Panel displays round-by-round discussions
   - Final Verdict page presents risk level, actions, and optimized code
   - System Logs update with timestamped activity and trace ID

### Technical Flow

```
Frontend (React)          Backend (Node.js/Express)        OpenAI API
     │                            │                           │
     │── POST /api/analyze ──────>│                           │
     │                            │── Orchestrator ──────────>│
     │                            │<── Plan + Routing ────────│
     │                            │                           │
     │                            │── Explainer ─────────────>│
     │                            │── Bug Hunter ────────────>│ (parallel)
     │                            │── Complexity ────────────>│
     │                            │<── All 3 Responses ───────│
     │                            │                           │
     │                            │── Debate Round 1-5+ ─────>│ (sequential)
     │                            │<── Rounds + Judge ────────│
     │                            │                           │
     │                            │── Supervisor ────────────>│
     │                            │<── Final Verdict ─────────│
     │                            │                           │
     │<── { traceId, results, logs } ─────────────────────────│
     │                            │                           │
     │── POST /api/chat ─────────>│                           │
     │   (with analysis context)  │── Chat (gpt-4o-mini) ────>│
     │<── { reply } ──────────────│<── Response ──────────────│
```

---

## 🌐 API Endpoints

### Health Check

#### `GET /api/health`

Returns server status and version.

**Response:**
```json
{
  "ok": true,
  "ts": "2025-01-20T00:00:00.000Z",
  "version": "2.0.0"
}
```

---

### Core Analysis

#### `POST /api/analyze`

Main entry point for code analysis. Orchestrates the full 6-agent pipeline and returns results for all agents plus a structured log.

**Request:**
```json
{
  "code": "function fibonacci(n) { ... }",
  "language": "javascript",
  "options": {}
}
```

**Response:**
```json
{
  "traceId": "abc123",
  "results": {
    "orchestrator": {
      "plan": "string",
      "routing": ["explainer", "bugHunter", "complexity"]
    },
    "explainer": {
      "overview": "string",
      "purpose": "string",
      "keyIdentifiers": ["string"],
      "inputs": "string",
      "outputs": "string",
      "blockByBlock": [{ "block": "string", "explanation": "string" }],
      "exampleTrace": "string",
      "edgeCases": ["string"],
      "improvements": ["string"]
    },
    "bugHunter": {
      "summary": "string",
      "findings": [
        {
          "severity": "critical|high|medium|low",
          "title": "string",
          "evidence": "string",
          "impact": "string",
          "fix": "string"
        }
      ],
      "quickWins": ["string"]
    },
    "complexity": {
      "time": { "bigO": "O(n)", "reasoning": "string" },
      "space": { "bigO": "O(1)", "reasoning": "string" },
      "hotspots": ["string"],
      "optimizations": ["string"]
    },
    "debate": {
      "topic": "string",
      "rounds": [
        {
          "round": 1,
          "speaker": "explainer|bugHunter|complexity",
          "type": "claim|rebuttal|counter|response|closing",
          "claim": "string",
          "evidence": "string",
          "rebuttals": ["string"],
          "concessions": ["string"],
          "proposedFixes": ["string"]
        }
      ],
      "consensus": {
        "isProductionReady": false,
        "topPriorities": ["string"],
        "rationale": "string"
      }
    },
    "supervisor": {
      "summary": "string",
      "riskLevel": "low|medium|high",
      "prioritizedActions": ["string"],
      "optimizedCode": "string",
      "notes": "string"
    },
    "finalVerdict": { }
  },
  "logs": [
    { "ts": "2025-01-20T00:00:00.000Z", "level": "info|warn|error", "message": "string" }
  ]
}
```

---

### Chat

#### `POST /api/chat`

Context-aware chat with the AI assistant. If analysis results are provided, the assistant is aware of the code, agent findings, debate consensus, and final verdict.

**Request:**
```json
{
  "message": "What are the main bugs found?",
  "history": [
    { "role": "user", "content": "string" },
    { "role": "assistant", "content": "string" }
  ],
  "context": {
    "hasAnalysis": true,
    "code": "string",
    "explainer": { },
    "bugHunter": { },
    "complexity": { },
    "debate": { },
    "finalVerdict": { }
  }
}
```

**Response:**
```json
{
  "reply": "string"
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
- **OpenAI API Key** (required for full AI functionality)
- **Google Gemini API Key** (optional, scaffolded for future multi-model routing)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/Code_Council.git

# Navigate to project directory
cd Code_Council

# Install root dependencies (includes concurrently, wait-on)
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Start both frontend and backend simultaneously
npm run dev:all
```

The application will be available at:
- **Frontend**: `http://localhost:5173` (Vite dev server)
- **Backend**: `http://localhost:3000` (Express API server)
- **Health Check**: `http://localhost:3000/api/health`

### Running Servers Individually

```bash
# Frontend only
npm run dev
# or
npm run dev:frontend

# Backend only
npm run dev:backend
```

### How `dev:all` Works

`npm run dev:all` uses `concurrently` and `wait-on` to:
1. Start the backend Express server on port 3000
2. Wait for `http://localhost:3000/api/health` to respond
3. Then start the frontend Vite dev server on port 5173
4. Display color-coded logs with `[backend]` and `[frontend]` prefixes

### Build for Production

```bash
# Type check and build
npm run build

# Preview production build
npm run preview
```

---

## 🔧 Environment Variables

Create a `.env` file in the `backend/` directory (NOT the project root):

```env
# OpenAI API Configuration (Required for full AI functionality)
OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini API Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# Server port (Optional, defaults to 3000)
PORT=3000

# Environment mode (Optional, enables verbose logging)
NODE_ENV=development
```

**⚠️ Important:**
- API keys MUST be placed in `backend/.env` (not the root `.env`)
- Never commit your `.env` file — it is already covered by `.gitignore`
- The application gracefully degrades to stub responses when `OPENAI_API_KEY` is missing, but full AI functionality requires it
- `GEMINI_API_KEY` is scaffolded but not used in the current analysis pipeline
- The Debate Agent uses `gpt-4o` as its primary model and falls back to `gpt-4o-mini`

---

## 🧩 Backend Architecture Details

### Soft Validation Strategy

All Zod schemas use optional fields with defaults so partial LLM responses are accepted rather than rejected. Each schema has a corresponding `createFallback*()` function that generates a safe stub when validation fails entirely. This ensures the UI always receives a complete, renderable response.

### Tolerant JSON Parsing

`jsonParse.js` uses 6 sequential extraction strategies to handle malformed LLM output:
1. Direct `JSON.parse()`
2. Extract from `<json>…</json>` tags
3. Extract from ` ```json … ``` ` code blocks
4. Balanced brace matching
5. Simple `{…}` regex extraction
6. Balanced bracket matching for arrays

### Trace IDs & Logging

Every `POST /api/analyze` request is assigned a unique trace ID. The response includes a structured `logs` array with ISO timestamps, log levels (`info | warn | error`), and messages for each pipeline step — useful for debugging agent failures in production.

### Parallel + Sequential Execution

The analyze pipeline is optimized:
- **Parallel**: Explainer, BugHunter, and Complexity run concurrently via `Promise.all`
- **Sequential**: Debate requires the three parallel outputs; Supervisor requires the debate output

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

1. **Multi-Agent System Design** — Shows understanding of complex AI orchestration architectures
2. **Prompt Engineering** — Demonstrates ability to craft effective, schema-enforced LLM prompts
3. **Full-Stack Development** — Modern React + TypeScript frontend with a live Node.js/Express backend
4. **Resilient API Design** — Soft validation, tolerant JSON parsing, stub fallbacks, and trace IDs
5. **UI/UX Excellence** — Beautiful, functional interface that makes AI reasoning transparent

### Interview Advantages

- **Technical Depth**: Discuss orchestration patterns, parallel vs sequential agent execution, and LLM integration
- **Problem-Solving**: Explain how multi-agent debate improves code analysis quality over single-model review
- **Production Readiness**: Show understanding of error handling, graceful degradation, and request tracing
- **Modern Stack**: Demonstrate proficiency with React, TypeScript, Express, Zod, and OpenAI SDK

### What Employers Learn

This project reveals:
- **Architecture Skills**: Can design and implement complex distributed AI systems
- **AI Engineering**: Understands LLM capabilities, limitations, and prompt design best practices
- **Code Quality**: Writes maintainable, type-safe, well-documented code
- **User Focus**: Builds interfaces that are both beautiful and functional

---

## 🏗️ Roadmap

### Phase 1: Backend Integration ✅ Complete
- [x] Node.js/Express backend (v5.1.0) fully implemented
- [x] OpenAI API integration with all 6 agents
- [x] Multi-agent orchestration with parallel + sequential execution
- [x] Zod schema validation with soft-validation strategy
- [x] Tolerant JSON parsing (6 extraction strategies)
- [x] Trace IDs and structured request logging
- [x] Graceful degradation with stub responses when API key is absent
- [x] Context-aware chat endpoint

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
- [ ] Activate Gemini multi-model routing (scaffolded)

### Phase 4: Interactive Features
- [ ] Voice-enabled agent interactions
- [ ] Real-time collaborative editing
- [ ] Agent performance metrics dashboard
- [ ] Custom agent configuration

### Phase 5: Enterprise Features
- [ ] Model switching (GPT-4o, Claude, Gemini)
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

**Built with ❤️ using React, TypeScript, Node.js, Express, and OpenAI**

[⭐ Star this repo](https://github.com/yourusername/Code_Council) | [🐛 Report Bug](https://github.com/yourusername/Code_Council/issues) | [💡 Request Feature](https://github.com/yourusername/Code_Council/issues)

</div>
