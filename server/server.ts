const express = require('express');          // Express web framework for serving the client files
const http = require('http');                // Node HTTP server module
const path = require('path');                // Utility for safely building file paths
const { Server } = require('socket.io');     // Socket.io server for real-time signaling between client/server
const { usersRouter } = require('./api/users');
const { messagesRouter } = require("./api/messaging");
const { conversationsRouter } = require("./api/conversations");
const app = express();                       // Create the Express app
const server = http.createServer(app);       // Wrap Express in a raw HTTP server
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:8081",
  "http://192.168.40.54:8081",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

const { socketAuth } = require("./sockets/socketAuth");
const { bindUserToSocket, unbindSocket } = require("./sockets/socketBindings");

const { createWorkerAndRouter } = require('./mediasoup/mediasoup');
const registerSocketHandlers = require('./sockets/socketHandlers');



app.use(cors());
app.use(express.json());
app.use('/api', usersRouter);
app.use('/api', conversationsRouter);
app.use('/api', messagesRouter);
app.set('io', io);

// Serve everything in ../testclient as static files
// So opening localhost:3000 will load the browser client from that folder

app.use(express.static(path.join(__dirname, '../testclient')));

io.use(socketAuth);
io.on('connection', (socket) => {
  const userId = socket.user.userId;
  
  bindUserToSocket(userId, socket.id);
  console.log(`user ${userId} bound to socket ${socket.id}`);

  socket.on("disconnect",()=>{
    unbindSocket(socket.id);
    console.log(`socket disconnected ${socket.id}`);
  });

  socket.on("joinConversation", ({ conversationId }) => {
    console.log("join conversation", conversationId, socket.id);
    socket.join(conversationId);
  });

  socket.on("leaveConversation", ({ conversationId }) => {
    console.log("leave conversation", conversationId, socket.id);
    socket.leave(conversationId);
  });

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
