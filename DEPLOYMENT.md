# CricScript AI — Production Deployment Guide
**Target Architecture:** Vercel (Frontend SPA) + Render (Node/Express Stateless API)

---

## 1. System Topology Overview

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

## 2. Render Backend Deployment

### Step 1: Create Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service**.
3. Connect your Git repository (`CricPitch`).
4. Configure service settings:
   - **Name:** `cricscript-ai-backend`
   - **Region:** Choose the region closest to your audience (e.g. `Oregon (US West)` or `Frankfurt (EU)`).
   - **Branch:** `main` (or `master`)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install --omit=dev`
   - **Start Command:** `node server.js`
   - **Instance Type:** `Starter` ($7/mo recommended for production concurrency) or `Free`.

### Step 2: Configure Backend Environment Variables
In the Render dashboard under **Environment**, add the following variables:

| Variable Name | Required | Value Description |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` |
| `PORT` | Yes (Auto) | Render assigns `10000` automatically. |
| `GEMINI_API_KEY` | **Yes** | Active Google AI Studio API key with Gemini 3.8/3.1 access. |
| `TAVILY_API_KEY` | **Yes** | Tavily Web Search API key for multi-hop research. |
| `FRONTEND_URL` | **Yes** | Deployed Vercel frontend URL (e.g. `https://cricpitch.vercel.app`). |
| `ALLOWED_ORIGINS` | Optional | Additional allowed CORS origins (e.g. `https://cricpitch.com`). |
| `PINECONE_API_KEY` | Optional | Pinecone API key (if omitted, uses built-in local style exemplar archive). |
| `PINECONE_INDEX_NAME` | Optional | `cricscript-rag` |

### Step 3: Health & Readiness Verification
Once Render deploys, test the health check endpoints:
```bash
# Liveness probe
curl -i https://cricscript-ai-backend.onrender.com/api/v1/health

# Readiness probe
curl -i https://cricscript-ai-backend.onrender.com/api/v1/ready
```

---

## 3. Vercel Frontend Deployment

### Step 1: Import Project on Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** → **Project** and select your repository.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Step 2: Configure Frontend Environment Variables
In Vercel under **Settings** → **Environment Variables**:

| Variable Name | Environment | Value Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Production & Preview | `https://cricscript-ai-backend.onrender.com` |

*Note: Do NOT append `/api/v1` to `VITE_API_BASE_URL`; the client service automatically attaches the appropriate API version prefix.*

### Step 3: Deploy & Verify Custom Domain
1. Click **Deploy**.
2. Once deployed, verify:
   - Landing page loads with 4K stadium visuals and `<picture>` tags.
   - Click **Enter Studio** → Engine Hub loads smoothly.
   - Verify that `/privacy`, `/terms`, and `/404` direct routes work on direct browser refresh.

---

## 4. Post-Deployment Smoke Test Checklist

- [ ] `GET /api/v1/health` returns `HTTP 200 OK`.
- [ ] `GET /api/v1/ready` returns `HTTP 200 OK` with `status: "ready"`.
- [ ] POST request from unauthorized origin is blocked with CORS error.
- [ ] Research dossier compiles and downloads as PDF.
- [ ] Hinglish script generates 3 structured parts under 1,000 words.
- [ ] Submitting > 15 requests in 15 minutes triggers HTTP 429 rate limit response.
- [ ] Theme toggles between dark mode (`#08090B`) and light mode (`#F4F5F7`).
