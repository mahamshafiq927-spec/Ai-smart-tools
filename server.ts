import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { handleApiRoute } from './server/apiMiddleware.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// Mount /api routes using our unified handler
app.all('/api/*', async (req, res) => {
  const handled = await handleApiRoute(req, res);
  if (!handled && !res.headersSent) {
    res.status(404).json({ error: 'API route not found' });
  }
});

// Serve frontend static assets from dist
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// SPA Fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[MagicAI Server] Running on http://localhost:${PORT}`);
});
