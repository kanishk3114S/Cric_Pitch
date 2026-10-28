// server.js — Entry point. Starts Express and connects all routes.

import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import researchRoutes from './routes/research.routes.js';
import scriptRoutes from './routes/script.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ── Security & Parsing Middleware ──────────────────────────────────────────
app.use(helmet());                          // Sets safe HTTP headers
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());                    // Parses incoming JSON bodies

// ── Routes ─────────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/v1/research', researchRoutes);
app.use('/api/v1/scripts', scriptRoutes);

// ── Global Error Handler (must be last) ────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ CricScript backend running on http://localhost:${PORT}`);
});
