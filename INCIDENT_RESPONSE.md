# CricScript AI — Operational Incident Response Runbook
**Target Audience:** Engineering, DevOps, and Platform Maintainers

---

## 1. Severity Classification

| Level | Definition | Response Time | Actions |
| :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Complete service outage, API down, or upstream quota exhausted causing 100% generation failure. | < 30 minutes | Incident commander assigned; check Render logs & Google AI Studio quota. |
| **SEV-2 (High)** | Degradation of one engine (e.g. Tavily search failure), elevated error rates (> 10%), or severe rate-limit false positives. | < 2 hours | Investigate provider health; switch to local fallback or adjust thresholds. |
| **SEV-3 (Medium)** | Minor styling regression, individual edge-case validation failure, non-breaking latency spike. | Next business day | Log ticket and deploy patch during standard sprint cycle. |

---

## 2. Common Scenarios & Step-by-Step Runbooks

### Scenario A: Google Gemini Quota Exhaustion (`QUOTA_EXHAUSTED` / 429)
**Symptom:** Users see the contextual `QUOTA_EXHAUSTED` alert in the studio. Backend logs show `RESOURCE_EXHAUSTED`.
1. **Verify Quota Status:**
   - Log into [Google AI Studio](https://aistudio.google.com/) and review your project’s request per minute (RPM) and token usage.
2. **Immediate Remediation:**
   - If free-tier credits are exhausted, link a billing account to activate Tier 1 pay-as-you-go capacity, OR generate a new API key.
3. **Update Render Environment:**
   - Go to Render Dashboard → `cricscript-ai-backend` → **Environment**.
   - Update `GEMINI_API_KEY` with the new key.
   - Click **Save Changes**. Render will automatically redeploy the service in < 60 seconds.
4. **Verification:**
   - Query `curl -s https://cricscript-ai-backend.onrender.com/api/v1/ready` to verify `geminiLlm: "configured"`.

---

### Scenario B: Automated Traffic Spike / Abusive Influx
**Symptom:** Rapid burst of incoming requests attempting to exhaust AI credits or saturate server CPU.
1. **Inspect Structured Logs:**
   - View Render live logs: search for `[WARN]` or `[INFO]` with high frequency from a specific IP.
2. **Mitigation via Rate Limiter:**
   - The built-in rate limiter will automatically return `HTTP 429` with `RateLimit-*` headers after 15 requests/15m.
3. **Temporary Cloudflare / Platform Block (if needed):**
   - If behind Cloudflare or a WAF, add an IP Access Rule or Cloudflare Security Rule to challenge or block the offending ASN/IP range.

---

### Scenario C: Backend Outage / Render Container Crash
**Symptom:** Frontend displays `Server synthesis failure` or `Network timeout`.
1. **Check Process Liveness:**
   ```bash
   curl -i https://cricscript-ai-backend.onrender.com/api/v1/health
   ```
2. **Inspect Container Exit Code:**
   - Review Render deployment logs for uncaught exceptions or out-of-memory (OOM) kills.
3. **Rollback Strategy:**
   - In the Render dashboard under **Deploys**, select the previous green deploy and click **Rollback to this deploy**.

---

### Scenario D: Suspected Credential Exposure
**Symptom:** Key appears in public logs or unintended third-party activity is observed.
1. **Immediate Revocation:**
   - Immediately revoke the compromised key in [Google AI Studio](https://aistudio.google.com/apikey) or [Tavily Dashboard](https://app.tavily.com/).
2. **Generate Replacement:**
   - Generate a replacement key with restricted scopes.
3. **Deploy to Render:**
   - Update `GEMINI_API_KEY` or `TAVILY_API_KEY` in Render environment variables.
4. **Audit Git History:**
   - Confirm via `git log -S "<key-fragment>" -p` that the secret was not committed to source control.
