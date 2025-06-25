const Fastify = require('fastify');
const websocketPlugin = require('@fastify/websocket');

const fastify = Fastify({ logger: true });
fastify.register(websocketPlugin);

let players = [];

fastify.get('/ws', { websocket: true }, (connection, req) => {
  console.log('Client connected');

  players.push(connection.socket);

  connection.socket.on('message', (message) => {
    console.log('Message received:', message.toString());

    // Broadcast para todos os outros jogadores
    players.forEach(sock => {
      if (sock !== connection.socket && sock.readyState === 1) {
        sock.send(message.toString());
      }
    });
  });

  connection.socket.on('close', () => {
    players = players.filter(sock => sock !== connection.socket);
  });
});

fastify.listen({ port: 8080 }, err => {
  if (err) throw err;
  console.log('WebSocket server on ws://localhost:8080/ws');
});
