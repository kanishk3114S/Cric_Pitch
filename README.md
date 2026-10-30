# 🏏 CricScript AI (CricPitch)
**Cinematic Cricket Documentary Research & Cadence Scriptwriting Studio**

[![CI / Production Quality Gate](https://github.com/your-org/cricscript-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/cricscript-ai/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Architecture](https://img.shields.io/badge/Architecture-Stateless%20Anonymous%20SaaS-D91F2B)](#-architecture-overview)
[![License](https://img.shields.io/badge/License-Proprietary-slate)](LICENSE)

---

## 📽️ Product Overview

Creating viral, high-retention cricket documentary videos requires two pillars that generic chatbots fail to deliver:
1. **Unassailable Ground-Truth Facts:** Exact ball-by-ball chronologies, reverse-swing physics, pitch deterioration, DRS controversy nuances, locker-room quotes, and high-resolution match photography.
2. **Authentic Narrative Cadence:** High-tension pacing, dramatic `[pause]` acoustic cues, and conversational Hinglish storytelling calibrated under 1,000 words to maximize viewer retention.

**CricScript AI** is an autonomous, dual-engine creator studio engineered specifically for sports creators, video essayists, and broadcast analysts.

### Dual-Engine Pipeline:
- **Engine 01 (Deep Research Agent):** Autonomous investigative agent. Runs multi-hop web searches across scorecards, pitch dynamics, and press conferences to compile verified chronologies, tactical nuances, and stats under strict zero-hallucination fact grounding. Exports instantly to high-contrast executive PDFs.
- **Engine 02 (Match Scriptwriter):** Transfers the acoustic cadence, dramatic pauses, and sentence rhythm of authentic cricket video essays. Generates 3-part Hinglish voiceover copy (Intro • Main • Outro) with teleprompter cues strictly under 1,000 words.

---

## 🏛️ Architecture Overview

CricScript AI operates as an **anonymous, stateless SaaS application**:
- **Zero-Identity Architecture:** No user registration, passwords, email capture, JWT tokens, session cookies, or tracking pixels.
- **Horizontal Scalability:** All requests are stateless; multiple backend container instances can process workloads interchangeably without shared session affinity.
- **In-Memory Streaming:** Queries and generated scripts are synthesized and streamed directly to client memory. No prompt logs or generated scripts are retained in persistent user databases.

```
                      [ HTTPS Client Browser ]
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
 [ Vercel Edge CDN ]                         [ Render Web Service ]
 • React 19 + Vite 8 SPA                     • Node.js 20 + Express 4 API
 • Static Assets (WebP/AVIF)                 • Multi-hop Research Agent
 • Security Headers & CSP                    • Cadence-RAG Script Agent
 • Client Router & Legal Pages               • Zero-Disk PDF Streaming Engine
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19.3 + Vite 8.3
- **Styling:** Tailwind CSS v4 + Semantic Design Tokens (`#08090B` Dark Charcoal Foundation, `#D91F2B` Crimson Accent)
- **State Management:** Zustand 5.0
- **Motion & Transitions:** Framer Motion 14.6
- **Icons:** Lucide React
- **Asset Formats:** True 4K (3840×2160) WebP/JPEG stadium backdrops, SVG favicons

### Backend
- **Runtime:** Node.js 20.x (ES Modules)
- **Framework:** Express 4.21
- **Security:** Helmet 8.0, Express Rate Limit 7.5, Strict CORS Origin Filter
- **PDF Generation:** PDFKit 0.15 (Zero-disk direct response streaming)
- **AI Synthesis:** Google Gemini 3.8 / 3.1 (`@google/genai` official SDK)
- **Web Intelligence:** Tavily Advanced Search API
- **Vector Retrieval:** Pinecone Database SDK 9.1 with resilient local style archive fallback

---

## 🔒 Security & Privacy Posture

- **OWASP Top 10 Hardened:** Input boundary enforcement via `middleware/validator.js` with length caps, control character stripping, and recursive prototype pollution checks (`__proto__`, `constructor`, `prototype`).
- **Tiered Rate Limiting:**
  - Global API: 120 req / 15 min per IP.
  - AI Generation: 15 generations / 15 min per IP.
  - PDF Compilation: 30 downloads / 15 min per IP.
- **Zero-SSRF Design:** Backend never fetches arbitrary user-provided URLs. External network calls are strictly restricted to official upstream provider SDKs. PDF image references are rendered as client-side text hyperlinks without server-side fetching.
- **Zero Tracking Cookies:** Confirmed cookie-free operation. Browser storage is used solely for `cricscript-theme` (`"dark"` / `"light"`).
- **Safe Error Classification:** Upstream AI provider errors (`QUOTA_EXHAUSTED`, `RATE_LIMITED`, `AUTH_FAILURE`, `TIMEOUT`) are normalized into structured user-friendly diagnostics without leaking internal stack traces or server paths.

---

## 📋 Local Development Setup

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/cricpitch.git
cd cricpitch
```

### 2. Configure Backend Environment
Create `backend/.env` based on `backend/.env.example`:
```bash
cp backend/.env.example backend/.env
```
Populate `backend/.env` with your genuine credentials:
```env
PORT=5000
NODE_ENV=development

# Google Gemini API Key (Required)
# https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Tavily Search API Key (Required for live research)
# https://tavily.com
TAVILY_API_KEY=your_tavily_api_key_here

# Pinecone Vector DB (Optional; falls back to local style archive)
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=cricscript-rag

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
# Install backend dependencies
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

### 4. Start Development Servers
Run backend and frontend in separate terminals:
```bash
# Terminal 1: Backend API (runs on http://localhost:5000)
npm --prefix backend run dev

# Terminal 2: Frontend SPA (runs on http://localhost:5173)
npm --prefix frontend run dev
```

---

## 🧪 Testing & Quality Assurance

```bash
# Run backend syntax self-check
node --check backend/server.js

# Run frontend linter (Oxlint)
npm --prefix frontend run lint

# Run production frontend build
npm --prefix frontend run build

# Run dependency security audits
npm --prefix backend audit --audit-level=high
npm --prefix frontend audit --audit-level=high
```

---

## 🌐 API Overview

All API endpoints are mounted under `/api/v1`:

| Method | Endpoint | Description | Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Liveness health check (status, uptime, timestamp) | 120 / 15m |
| `GET` | `/api/v1/ready` | Readiness check (upstream provider configuration flags) | 120 / 15m |
| `POST` | `/api/v1/research/generate` | Autonomous multi-hop research investigation | 15 / 15m |
| `POST` | `/api/v1/research/export-pdf` | Stream synthesized research dossier as executive PDF | 30 / 15m |
| `POST` | `/api/v1/scripts/generate` | Hinglish cadence-matched 3-part script generation | 15 / 15m |

---

## 🚀 Production Deployment

Refer to [`DEPLOYMENT.md`](DEPLOYMENT.md) for complete step-by-step instructions:
- **Frontend:** Deployed to Vercel with SPA route rewrites, immutable asset caching, and Content-Security-Policy headers via [`frontend/vercel.json`](frontend/vercel.json).
- **Backend:** Deployed to Render as a Web Service via [`render.yaml`](render.yaml) with automatic zero-downtime health checking.

---

## 📄 Privacy & Legal

- **Privacy Policy:** [`/privacy`](file:///frontend/src/views/PrivacyPolicyView.jsx) — Documents anonymous processing, zero-cookie operation, and DPDP Act 2023 / GDPR alignment.
- **Terms & Conditions:** [`/terms`](file:///frontend/src/views/TermsView.jsx) — Outlines fair use of public sports statistics, acceptable use, and output ownership.
- **Security Policy:** [`SECURITY.md`](SECURITY.md) — Threat model, security controls, and responsible disclosure instructions.
- **Incident Response:** [`INCIDENT_RESPONSE.md`](INCIDENT_RESPONSE.md) — Operational runbook for outages, rate limits, and key rotations.
