# Security Policy & Architecture Overview
**CricScript AI — Autonomous, Stateless Sports Content Platform**

---

## 1. Architectural Security Posture

CricScript AI adheres to a strict **zero-identity, anonymous, and stateless architecture**:
- **No User Registration or Accounts:** Users never provide passwords, usernames, phone numbers, or credit card details.
- **Zero Session Infrastructure:** The backend does not maintain JWTs, bearer sessions, cookies, Redis stores, or session databases.
- **Stateless Horizontal Scalability:** Any request can be serviced by any backend container instance without state dependency.
- **Data Minimization:** Queries and generated scripts are processed in memory and streamed directly back to the client browser. No historical user interaction logs or prompt contents are stored in a persistent database.

---

## 2. Threat Modeling & OWASP Controls

### 2.1 Injection & Malicious Input (OWASP A03:2021 / A05:2025)
- **Input Boundaries:** All public endpoints pass through [`validator.js`](file:///backend/middleware/validator.js).
- **String Sanitization:** User strings are trimmed, stripped of non-printable control characters, and length-capped:
  - Topics: 3 to 300 characters.
  - Pre-context focus angles: Maximum 8 items, each capped at 250 characters.
  - Key points: Maximum 10 items, each capped at 350 characters.
- **Prototype Pollution Prevention:** Request bodies are recursively validated to reject `__proto__`, `constructor`, and `prototype` keys.
- **JSON Payload Limits:** Global payload size is restricted to `150kb` via `express.json({ limit: '150kb' })`.

### 2.2 Server-Side Request Forgery (SSRF) Protection
- **No User-Supplied Outbound Fetches:** The backend never downloads arbitrary URLs passed in HTTP requests.
- **Controlled Upstream APIs:** External requests are strictly limited to hardcoded official SDKs and allowlisted endpoints:
  - Google Gemini API (`@google/genai`)
  - Tavily Search API (`https://api.tavily.com/search`)
  - Pinecone Vector Search (`@pinecone-database/pinecone`)
- **PDF Hyperlinks:** Photo references included in generated PDF briefs are embedded as client-side text hyperlinks (`doc.text(..., { link: url })`) and are never resolved, fetched, or rasterized on the server.

### 2.3 Public API Abuse & DoS Protection
- **Tiered Rate Limiting:** Applied via [`rateLimiter.js`](file:///backend/middleware/rateLimiter.js):
  - Global API: 120 requests / 15 minutes per IP.
  - AI Generation: 15 generations / 15 minutes per IP.
  - PDF Export: 30 downloads / 15 minutes per IP.
- **Response Headers:** `RateLimit-Limit`, `RateLimit-Remaining`, and `RateLimit-Reset` are returned on all API requests.

### 2.4 CORS & Transport Security
- **Strict Origin Whitelist:** Only explicit development origins and the configured `FRONTEND_URL` / `ALLOWED_ORIGINS` are accepted.
- **No Credentials:** `credentials: false` is enforced.
- **Security Headers (Helmet & Vercel):**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), browsing-topics=()`
  - Content Security Policy (CSP) restricting scripts, styles, media, and connections.

---

## 3. Reporting a Vulnerability

If you discover a security vulnerability or unexpected behavior, please report it privately:
- **Email:** security@[your-domain].com (or project owner contact)
- **Response SLA:** Acknowledgment within 48 hours; resolution plan within 7 business days.
- **Public Disclosure:** Please practice responsible disclosure by coordinating with the project maintainers prior to publishing details.
