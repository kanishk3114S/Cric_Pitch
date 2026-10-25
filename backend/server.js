// server.js — Entry point. Starts Express and connects all routes.

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import researchRoutes from './routes/research.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Parsing Middleware ──────────────────────────────────────────
app.use(helmet());                          // Sets safe HTTP headers
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());                    // Parses incoming JSON bodies

// ── Routes ─────────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/v1/research', researchRoutes);

// ── Global Error Handler (must be last) ────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ CricScript backend running on http://localhost:${PORT}`);
});
