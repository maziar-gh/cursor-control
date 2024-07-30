const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 3000 });

let latestPosition = { x: 0, y: 0 }; // Store the latest cursor position

server.on('connection', socket => {
  console.log('Client connected');

  // Send the latest position to the new client
  socket.send(JSON.stringify({ type: 'update', ...latestPosition }));

  // Handle incoming messages from clients
  socket.on('message', message => {
    console.log('Received message from client:', message);
    try {
      const data = JSON.parse(message);
      if (data.type === 'move') {
        latestPosition = { x: data.x, y: data.y }; // Update the latest position
        console.log('Broadcasting updated position:', latestPosition);
        server.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'update', ...latestPosition }));
          }
        });
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

console.log('WebSocket server is running on ws://localhost:3000');
