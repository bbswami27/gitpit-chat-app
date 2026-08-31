import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for all cross-device cross-city requests
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const signalHub = [];

// Production Cloud Signaling Hub for Nationwide / Cross-City Calling & Chatting
app.post('/api/signal', (req, res) => {
  try {
    const payload = req.body;
    payload._id = 'sig_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    signalHub.push(payload);
    if (signalHub.length > 300) signalHub.shift();
    res.json({ success: true, payload });
  } catch (e) {
    res.status(400).json({ error: 'Invalid payload' });
  }
});

app.get('/api/signal', (req, res) => {
  const since = Number(req.query.since || '0');
  const phone = (req.query.phone || '').replace(/\D/g, '').slice(-10);

  const freshSignals = signalHub.filter((s) => {
    const isNew = s.timestamp > since;
    if (!isNew) return false;
    if (!phone) return true;
    const targetClean = s.targetPhone ? s.targetPhone.replace(/\D/g, '').slice(-10) : '';
    const isTarget = targetClean === phone;
    const isBroadcast = !s.targetPhone;
    return isTarget || isBroadcast;
  });

  res.json({ signals: freshSignals });
});

// Serve static production build dist folder
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 GitPit Realtime Production Server running on port ${PORT}`);
});
