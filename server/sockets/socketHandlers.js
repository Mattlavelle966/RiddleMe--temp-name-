const { getPeer, getPeers } = require('../peers/peers');
const { createTransport, getRouter } = require('../mediasoup/mediasoup');

function registerSocketHandlers(socket, io) {
  // Fires every time a browser/client connects through Socket.io
  console.log('connected:', socket.id);

  // Get or create the server-side peer record for this socket
  const peer = getPeer(socket.id);

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
      socket.broadcast.emit('newProducer', {
        producerId: producer.id,
        socketId: socket.id
      }); 
  
      // Return the producer id to the client that created it
     callback({ id: producer.id });  
    } catch (error) {  
     callback({ error: error.message });  
    }  
  });  
  
  socket.on('getProducers', (_data, callback) => {
    // Client asks for all currently existing producers from all OTHER peers
    // This is how a newly joined client discovers already-active remote audio streams
    const producerIds = [];
    const peers = getPeers();
    

    console.log("searching for peers");
    for (const [otherSocketId, otherPeer] of peers.entries()) {
      // Skip this client's own producers
      if (otherSocketId === socket.id){
        console.log(`Id Match!! skipping current socket expected:${socket.id}, found:${otherSocketId}`);
        continue;
      };
  
      // Add every producer id from the other peer
      for (const producer of otherPeer.producers.values()) {
        console.log("adding found producers to producer list");
        producerIds.push(producer.id);
      }  
    }  
    console.log(`sending socket:${socket.id} latest producer list`);
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

      // Remove the peer entirely from the peers map
      peers.delete(socket.id);
    }

    console.log('disconnected:', socket.id);
  });
}

module.exports = registerSocketHandlers;
