const { getPeer, getPeers } = require('../peers/peers');
const { createTransport, getRouter } = require('../mediasoup/mediasoup');
const { randomUUID } = require("crypto");
const { getSocketIdByUserId } = require("./socketBindings");
const {joinCall,leaveCall,getCallIdBySocketId,getSocketIdsByCallId,} = require("./callBindings");
const {createPendingCall,getPendingCall,removePendingCall,} = require("./pendingCalls");



function registerSocketHandlers(socket, io) {
  // Fires every time a browser/client connects through Socket.io
  console.log('connected:', socket.id);

  // Get or create the server-side peer record for this socket
  const peer = getPeer(socket.id);
    
  socket.on("connectToUser", ({ targetUserId }, callback) => {
    console.log("connectToUser hit", targetUserId);
    const targetSocketId = getSocketIdByUserId(targetUserId);
    console.log("targetSocketId resolved:", targetSocketId);
    try {
      const targetSocketId = getSocketIdByUserId(targetUserId);

      if (!targetSocketId) {
        return callback({ error: "target user is offline" });
      }

      const callId = randomUUID();

      createPendingCall(callId, socket.id, targetSocketId, {
        userId: socket.user.userId,
        username: socket.user.username,
      });

      const targetSocket = io.sockets.sockets.get(targetSocketId);
      console.log("targetSocket exists:", !!targetSocket);
      if (targetSocket) {
        console.log("emitting incomingCall to target socket", targetSocketId);
        targetSocket.emit("incomingCall", {
          callId,
          callerId: socket.user.userId,
          callerName: socket.user.username,
        });
        console.log("incomingCall emitted", {
          callId,
          callerId: socket.user.userId,
          callerName: socket.user.username,
        });
      }

      callback({ ok: true, callId });
    } catch (error) {
      callback({ error: error.message });
    }
  });
  
  
  //acceptCall
  socket.on("acceptCall", ({ callId }, callback) => {
    const pendingCall = getPendingCall(callId);

    if (!pendingCall) {
      return callback({ ok: false, error: "call not found" });
    }

    if (pendingCall.targetSocketId !== socket.id) {
      return callback({ ok: false, error: "not your call" });
    }

    const callerSocket = io.sockets.sockets.get(pendingCall.callerSocketId);
    const targetSocket = io.sockets.sockets.get(pendingCall.targetSocketId);

    if (!callerSocket || !targetSocket) {
      removePendingCall(callId);
      return callback({ ok: false, error: "caller or target disconnected" });
    }

    joinCall(pendingCall.callerSocketId, callId);
    joinCall(pendingCall.targetSocketId, callId);

    callerSocket.join(`call:${callId}`);
    targetSocket.join(`call:${callId}`);

    callerSocket.emit("callAccepted", { callId });
    targetSocket.emit("callAccepted", { callId });

    removePendingCall(callId);

    callback({ ok: true, callId });
  });
  

  //DeclineCall
  socket.on("declineCall", ({ callId }, callback) => {
    const pendingCall = getPendingCall(callId);

    if (!pendingCall) {
      return callback({ ok: false, error: "call not found" });
    }

    if (pendingCall.targetSocketId !== socket.id) {
      return callback({ ok: false, error: "not your call" });
    }

    const callerSocket = io.sockets.sockets.get(pendingCall.callerSocketId);

    if (callerSocket) {
      callerSocket.emit("callDeclined", { callId });
    }

    removePendingCall(callId);

    callback({ ok: true });
  });

  socket.on('getRouterRtpCapabilities', (_data, callback) => {
    // Client asks what codecs/capabilities the mediasoup router supports
    // The client needs this to know how to send data to the server
    console.log("getting codecs capabilities");
    callback(getRouter().rtpCapabilities);
  });

  //client wants to open stram pipe for real time coms
  socket.on('createWebRtcTransport', async ({ direction }, callback) => {
    try {
      // Client asks the server to create a transport
      // direction is usually "send" or "recv"
      const transport = await createTransport();
      console.log("transport initialized");


      // Store transport data  
      transport.appData = { socketId: socket.id, direction };
      console.log("saving transport data");

      // associate transport data with a peer
      peer.transports.set(transport.id, transport);
      console.log(`peer ${socket.id} transports set -> transport ${transport.id}`);


      // Send the transport connection details back to the client
      // The client uses these to create its local transport object
      callback({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters
      });

    } catch (error) {
      callback({ error: error.message });
    }
  });

  socket.on('connectTransport', async ({ transportId, dtlsParameters },callback) => {
    try {
      // Client sends datagram transport Layer security parameters to finish connecting an existing transport
      console.log(`connecting transport:${transportId}`);
      console.log("Datagram Transport Layer Security Parameters:");
      console.log(dtlsParameters);
      const transport = peer.transports.get(transportId);
      
      if (!transport) throw new Error('transport not found');
      console.log("TransportId found");

      // Complete DTLS handshake on the mediasoup side
      await transport.connect({ dtlsParameters });
      

     callback({ ok: true });
    } catch (error) {
     callback({ error: error.message });
    }
  });

  socket.on('produce', async ({ transportId, kind, rtpParameters },callback) => {
    try {
      // client wants to send media over its send transport pipe
      console.log(`produce EVENT, trying to get transportId:${transportId}`)
      const transport = peer.transports.get(transportId);
      if (!transport) throw new Error('transport not found');
      console.log("transportId found!");
      // Create a producer on that transport
      // A producer represents a media source, like a microphone track
      console.log("making producer on transport");
      const producer = await transport.produce({ kind, rtpParameters });
  

      console.log(`saving producer:${producer.id} under peer:${socket.id}`);
      // Save it under this peer using producer.id
      peer.producers.set(producer.id, producer);

      // If the transport closes, this producer is no longer valid, so remove it
      producer.on('transportclose', () => {
        console.log(`transport:${transportId} closed`);
        peer.producers.delete(producer.id);
      });

      // Notify every other connected client that a new producer now exists
      // They can then choose to consume it
      console.log("Telling peers there is a new producer to listen to");
      const callId = getCallIdBySocketId(socket.id);
      if (callId) {
        socket.to(`call:${callId}`).emit("newProducer", {
          producerId: producer.id,
          socketId: socket.id,
          callId
        });
      }
  
      // Return the producer id to the client that created it
     callback({ id: producer.id });  
    } catch (error) {  
     callback({ error: error.message });  
    }  
  });  
    
  socket.on("getProducers", (_data, callback) => {
    const producerIds = [];
    const peers = getPeers();
    const callId = getCallIdBySocketId(socket.id);

    if (!callId) {
      return callback([]);
    }

    const socketIds = getSocketIdsByCallId(callId);

    for (const otherSocketId of socketIds) {
      if (otherSocketId === socket.id) continue;

      const otherPeer = peers.get(otherSocketId);
      if (!otherPeer) continue;

      for (const producer of otherPeer.producers.values()) {
        producerIds.push(producer.id);
      }
    }

    callback(producerIds);
  });
 
  socket.on('consume', async ({ transportId, producerId, rtpCapabilities }, callback) => {
    try {
      const router = getRouter();

      // Before consuming, make sure this router/client combination is allowed to consume that producer
      if (!router.canConsume({ producerId, rtpCapabilities })) {
        throw new Error('cannot consume this producer');
      }

      // Find the transport tunnel the client wants to use
      const transport = peer.transports.get(transportId);
      console.log(`looking for transport tunnel:${transportId}`);
      if (!transport) throw new Error('transport not found');


      // Create a consumer for the given producer
      // paused: true means the consumer starts paused until the client is fully ready
      const consumer = await transport.consume({
        producerId,
        rtpCapabilities,
        paused: true
      });
      console.log(`Transport consumer created`);

      // Save the consumer under this peer using consumer.id
      peer.consumers.set(consumer.id, consumer);
      console.log(`consumer:${consumer.id} saved`);

      // If the transport closes, remove the consumer from this peer record
      consumer.on('transportclose', () => {
        console.log(`transport closed, removing consumer:${consumer.id}`);
        peer.consumers.delete(consumer.id);
      });

      // Send the consumer details back to the client
      // The client uses these values to create its local receiving consumer
      console.log(`Sending Socket:${socket.id} receive details`);
      callback({
        id: consumer.id,
        producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters
      });
    } catch (error) {
      callback({ error: error.message });
    }
  });

  socket.on('resumeConsumer', async ({ consumerId },callback) => {
    try {
      // Once the client has created the local consumer/track and is ready,
      // it asks the server to resume the paused consumer
      const consumer = peer.consumers.get(consumerId);
      if (!consumer) throw new Error('consumer not found');

      await consumer.resume();
     callback({ ok: true });
    } catch (error) {
     callback({ error: error.message });
    }
  });

  socket.on('disconnect', () => {
    // Fires when the socket disconnects
    const peers = getPeers();
    const currentPeer = peers.get(socket.id);

    if (currentPeer) {
      // Close all consumers for this peer
      for (const consumer of currentPeer.consumers.values()) consumer.close();

      // Close all producers for this peer
      for (const producer of currentPeer.producers.values()) producer.close();

      // Close all transports for this peer
      for (const transport of currentPeer.transports.values()) transport.close();


      leaveCall(socket.id);
      // Remove the peer entirely from the peers map
      peers.delete(socket.id);
    }

    console.log('disconnected:', socket.id);
  });

  socket.on("joinConversation", ({ conversationId }) => {
    const room = String(conversationId);
    socket.join(room);
    console.log(`Socket ${socket.id} joined chat room: ${room}`);
  });

  socket.on("leaveConversation", ({ conversationId }) => {
    const room = String(conversationId);
    socket.leave(room);
    console.log(`Socket ${socket.id} left chat room: ${room}`);
  });
}

module.exports = registerSocketHandlers;
