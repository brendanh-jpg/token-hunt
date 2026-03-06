// Test WebSocket server for Token Hunt live stream mode
// Usage: npm install ws && node test-ws-server.js
// Sends random token usage events every 1.5-4.5 seconds

const { WebSocketServer } = require('ws');
const wss = new WebSocketServer({ port: 8080, path: '/stream' });

const models = ['claude-sonnet-4-20250514', 'claude-opus-4-20250514', 'claude-haiku-4-5-20251001'];
const users = ['alice', 'bob', 'charlie', 'dave', 'eve'];
const prompts = [
  'refactor the auth module',
  'explain this error trace',
  'write unit tests for user service',
  'review PR #42 for security issues',
  'fix the build pipeline',
  'optimize the database queries',
  'add dark mode to dashboard',
  'debug the payment flow',
  'implement rate limiting',
  'update API documentation',
];

wss.on('connection', (ws) => {
  console.log('Client connected');

  const send = () => {
    if (ws.readyState !== 1) return;
    const model = models[Math.floor(Math.random() * models.length)];
    const isOpus = model.includes('opus');
    const isHaiku = model.includes('haiku');

    const msg = {
      model,
      input_tokens: Math.floor(Math.random() * (isOpus ? 8000 : 5000)) + 100,
      output_tokens: Math.floor(Math.random() * (isOpus ? 20000 : 10000)) + 200,
      cache_read_input_tokens: Math.random() > 0.5 ? Math.floor(Math.random() * 50000) : 0,
      cache_creation_input_tokens: Math.random() > 0.8 ? Math.floor(Math.random() * 10000) : 0,
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      user: users[Math.floor(Math.random() * users.length)],
    };

    ws.send(JSON.stringify(msg));
    console.log(`  → ${msg.user}: ${msg.model.split('-')[1]} | ${msg.input_tokens + msg.output_tokens} tokens | "${msg.prompt}"`);

    // Schedule next event
    const delay = 1500 + Math.random() * 3000;
    setTimeout(send, delay);
  };

  // Start sending after a brief delay
  setTimeout(send, 500);

  ws.on('close', () => console.log('Client disconnected'));
});

console.log('Token Hunt test server running on ws://localhost:8080/stream');
console.log('Open the game and click LIVE STREAM → CONNECT & PLAY');
