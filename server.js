// Sofá Royale — servidor: sirve el juego y reparte los mensajes entre jugadores.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const page = fs.readFileSync(path.join(__dirname, 'index.html'));

const server = http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200); return res.end('ok'); }
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
  res.end(page);
});

const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 8 * 1024 });
const players = new Map(); // id -> { ws, presence }
let dirty = false;
const TOPICS = new Set(['start', 'shot', 'ko', 'pick']);
const newId = () => Math.random().toString(36).slice(2, 10);

wss.on('connection', (ws) => {
  const id = newId();
  const me = { ws, presence: {}, budget: 80, last: Date.now() };
  players.set(id, me);
  ws.send(JSON.stringify({ t: 'hello', id }));
  dirty = true;

  ws.on('message', (raw) => {
    // límite simple de mensajes por segundo
    const now = Date.now();
    me.budget = Math.min(80, me.budget + ((now - me.last) / 1000) * 60);
    me.last = now;
    if (me.budget < 1) return;
    me.budget -= 1;

    let m;
    try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'p' && m.d && typeof m.d === 'object') {
      Object.assign(me.presence, m.d);
      for (const k of Object.keys(me.presence)) if (me.presence[k] === null) delete me.presence[k];
      if (JSON.stringify(me.presence).length > 4096) me.presence = {};
      dirty = true;
    } else if (m.t === 'e' && TOPICS.has(m.topic)) {
      const out = JSON.stringify({ t: 'e', topic: m.topic, d: m.d, from: id });
      for (const p of players.values()) if (p.ws.readyState === 1) p.ws.send(out);
    }
  });
  ws.on('close', () => { players.delete(id); dirty = true; });
});

// manda la lista de jugadores ~20 veces por segundo cuando cambia algo
setInterval(() => {
  if (!dirty) return;
  dirty = false;
  const list = [...players].map(([peer, p]) => ({ peer, presence: p.presence }));
  const out = JSON.stringify({ t: 'peers', list });
  for (const p of players.values()) if (p.ws.readyState === 1) p.ws.send(out);
}, 50);

server.listen(PORT, () => console.log('Sofá Royale listo en el puerto ' + PORT));
