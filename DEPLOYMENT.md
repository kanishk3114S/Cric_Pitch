# CricScript AI — Production Deployment Guide
**Recommended Architecture:** Unified Single-Service Full-Stack Deployment on Render (Zero-CORS, Single Domain)

---

## 1. Unified Single-Service Deployment (Recommended)

In this deployment model, Render builds both your Vite frontend and Express backend. The Express server serves the compiled frontend (`frontend/dist`) as static assets and handles API requests under `/api/v1/*` on the **exact same domain**.

### Why This Is Better:
- **Zero CORS / Cross-Domain Issues:** Frontend and Backend live on the exact same origin (`https://cricscript-ai-backend.onrender.com`).
- **Single URL:** Visiting the root URL (`/`) immediately opens the full website.
- **Unified Process Lifecycle:** One build, one server process, one dashboard to monitor.
- **No 404s on Root:** Both `GET /` and `HEAD /` return the application with `HTTP 200 OK`.

```
                    [ HTTPS Client Browser ]
                               │
                               ▼
            [ Render Web Service: Unified Full-Stack ]
            https://cricscript-ai-backend.onrender.com
            ├── GET /                  ──► Serves Vite 8 SPA (Landing Page)
            ├── GET /hub, /research... ──► Client-side SPA Routing
            ├── GET /assets/*          ──► High-performance Static Cache
            └── POST /api/v1/*         ──► Research & Script Agents
```

---

## 2. Step-by-Step Render Setup (5 Minutes)

### Step 1: Open Your Existing Service on Render
If you have already created `cricscript-ai-backend` on [Render](https://dashboard.render.com/):
1. Go to your service dashboard.
2. Click **Settings** in the left sidebar.
3. Update the following fields:
   - **Root Directory:** *Leave blank* (clear `backend` so it defaults to repository root).
   - **Build Command:**
     ```bash
     npm --prefix frontend install && npm --prefix frontend run build && npm --prefix backend install --omit=dev
     ```
   - **Start Command:**
     ```bash
     node backend/server.js
     ```
   - **Health Check Path:** `/api/v1/health`
4. Click **Save Changes**.

*(Or if creating a new service, select your repository and paste the Build and Start commands above.)*

---

### Step 2: Configure Environment Variables
In the Render dashboard under **Environment**, set your API credentials:

| Variable Name | Required | Value / Description |
| :--- | :--- | :--- |
| `NODE_ENV` | Yes | `production` |
| `GEMINI_API_KEY` | **Yes** | Active Google AI Studio API key (Gemini 3.8 / 3.1 enabled). |
| `TAVILY_API_KEY` | **Yes** | Tavily Web Search API key for multi-hop research. |
| `PINECONE_API_KEY` | Optional | Pinecone API key (if omitted, uses built-in local style archive). |
| `PINECONE_INDEX_NAME` | Optional | `cricscript-rag` |

*Note: You do NOT need `FRONTEND_URL` in unified mode because browser requests are same-origin!*

---

### Step 3: Trigger Deploy & Verify
1. Click **Manual Deploy** → **Clear build cache & deploy**.
2. Watch the deployment log:
   - It will install frontend packages and run `vite build` (`dist/` created).
   - It will install backend packages.
   - It will start `node backend/server.js`:
     ```
     📦 Unified deployment active: serving compiled frontend from .../frontend/dist
     ✅ CricScript backend running on http://0.0.0.0:10000
     ```
3. Open your primary Render URL: `https://cricscript-ai-backend.onrender.com`
   - Your full website will open immediately with full 4K stadium visuals!
   - Test **Enter Studio** → **Engine Hub** → **Run Research Investigation**!

---

## 3. Alternative: Dual Deployment (Vercel Frontend + Render Backend)

If you ever wish to host the frontend separately on Vercel:
1. In Vercel, set Root Directory to `frontend`.
2. Add environment variable `VITE_API_BASE_URL=https://cricscript-ai-backend.onrender.com`.
3. In Render, set `FRONTEND_URL=https://your-vercel-app.vercel.app` to authorize CORS.

---

## 4. Verification Smoke Test

Once deployed, run these quick checks in your terminal:

```bash
# 1. Test root URL (should return HTML 200)
curl -I https://cricscript-ai-backend.onrender.com/

# 2. Test backend health probe (should return JSON status ok)
curl -s https://cricscript-ai-backend.onrender.com/api/v1/health

# 3. Test readiness probe (should verify Gemini & Tavily)
curl -s https://cricscript-ai-backend.onrender.com/api/v1/ready
```
