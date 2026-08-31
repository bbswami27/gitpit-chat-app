import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const signalHub: any[] = [];

// Real-Time GitPit Cross-Device Signaling Middleware Plugin
function gitpitSignalingPlugin() {
  return {
    name: 'gitpit-signaling-hub',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/api/signal')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              try {
                const payload = JSON.parse(body);
                payload._id = 'sig_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
                signalHub.push(payload);
                if (signalHub.length > 200) signalHub.shift();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, payload }));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
              }
            });
            return;
          }

          if (req.method === 'GET') {
            const urlObj = new URL(req.url, 'http://localhost');
            const since = Number(urlObj.searchParams.get('since') || '0');
            const phone = urlObj.searchParams.get('phone') || '';

            const freshSignals = signalHub.filter((s) => {
              const isNew = s.timestamp > since;
              if (!isNew) return false;
              if (!phone) return true;
              const matchesTarget = s.targetPhone && s.targetPhone.slice(-10) === phone.slice(-10);
              const isBroadcast = !s.targetPhone;
              return matchesTarget || isBroadcast;
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ signals: freshSignals }));
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    gitpitSignalingPlugin()
  ],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
