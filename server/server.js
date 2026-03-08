const express = require('express');          // Express web framework for serving the client files
const http = require('http');                // Node HTTP server module
const path = require('path');                // Utility for safely building file paths
const { Server } = require('socket.io');     // Socket.io server for real-time signaling between client/server

const app = express();                       // Create the Express app
const server = http.createServer(app);       // Wrap Express in a raw HTTP server
const io = new Server(server);               // Attach Socket.io to the HTTP server

const { createWorkerAndRouter } = require('./mediasoup/mediasoup');
const registerSocketHandlers = require('./sockets/socketHandlers');

// Serve everything in ../testclient as static files
// So opening localhost:3000 will load the browser client from that folder
app.use(express.static(path.join(__dirname, '../testclient')));

io.on('connection', (socket) => {
  registerSocketHandlers(socket, io);
});

(async () => {
  // Start mediasoup first so router/worker exist before any clients connect
  await createWorkerAndRouter();

  // Start the HTTP/Socket.io server
  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });
})();
