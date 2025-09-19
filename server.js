const mc = require('minecraft-protocol');
const WebSocket = require('ws');

const MC_HOST = process.env.MC_HOST || "hongyuwei947.aternos.me";
const MC_PORT = parseInt(process.env.MC_PORT) || 21653;

const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on('connection', (ws) => {
  const client = mc.createClient({
    host: MC_HOST,
    port: MC_PORT,
    username: 'WebPlayer' + Math.floor(Math.random() * 10000),
  });

  client.on('packet', (data, meta) => {
    try {
      ws.send(JSON.stringify({ meta, data }));
    } catch (e) {}
  });

  ws.on('message', (msg) => {
    try {
      const { meta, data } = JSON.parse(msg);
      client.write(meta.name, data);
    } catch (e) {}
  });

  client.on('end', () => ws.close());
  client.on('error', () => ws.close());
});
