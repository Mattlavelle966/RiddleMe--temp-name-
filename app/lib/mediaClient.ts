
import * as mediasoupClient from "mediasoup-client";
import { getSocket } from "./socket";

export class MediaClient {
  constructor() {
    this.socket = getSocket();   // Open a Socket.io connection to the signaling server

    if (!this.socket) {
      throw new Error("socket not initialized");
    }
    this.device = null;                           // mediasoup Device = browser-side representation of router capabilities
    this.sendTransport = null;                    // Transport used to send local media (your mic) to the server
    this.recvTransport = null;                    // Transport used to receive remote media from the server
    this.micProducer = null;                      // The producer created from this client's microphone track
    this.consumersByProducerId = new Map();       // Tracks remote consumers by producerId so we do not consume the same one twice
    this.onRemoteStream = null;                   // Optional callback the app can set to receive remote MediaStreams
  }

  request(event, data = {}) {
    // Small helper so socket request/response style feels like await
    // It emits an event to the server and resolves when the server calls the callback
    return new Promise((resolve) => {
      this.socket.emit(event, data, resolve);
    });
  }

  async init() {
    // Ask the server what RTP capabilities its mediasoup router supports
    // The client must know this before it can create/load a mediasoup Device
    const routerRtpCapabilities = await this.request('getRouterRtpCapabilities');

    // If the server responded with an error, stop here
    if (routerRtpCapabilities?.error) {
      throw new Error(routerRtpCapabilities.error);
    }

    // Create the browser mediasoup Device
    // This object understands what codecs/features the router supports
    this.device = new mediasoupClient.Device();

    // Load the router's RTP capabilities into the Device
    // After this, the Device knows how to talk to the server's router
    await this.device.load({ routerRtpCapabilities });

    // Create the transport that will be used to SEND local media
    await this.createSendTransport();

    // Create the transport that will be used to RECEIVE remote media
    await this.createRecvTransport();

    // Listen for newly created producers announced by the server
    // Example: another user turns on their mic, server broadcasts newProducer
    this.socket.on('newProducer', async ({ producerId }) => {
      try {
        // Try to consume that newly announced remote producer
        await this.consumeProducer(producerId);
      } catch (error) {
        console.error('consume new producer failed:', error);
      }
    });
  }

  async createSendTransport() {
    // Ask the server to create a WebRTC transport meant for sending media
    const data = await this.request('createWebRtcTransport', { direction: 'send' });

    // Stop if server returned an error
    if (data?.error) throw new Error(data.error);

    // Create the browser-side send transport using the server transport parameters
    this.sendTransport = this.device.createSendTransport(data);

    // mediasoup fires "connect" when the transport needs DTLS handshake info sent to the server
    this.sendTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        // Tell the server to connect the matching transport using these DTLS parameters
        const result = await this.request('connectTransport', {
          transportId: this.sendTransport.id,
          dtlsParameters
        });

        // If server had a problem, throw so errback runs
        if (result?.error) throw new Error(result.error);

        // Tell mediasoup client the connect step succeeded
        callback();
      } catch (error) {
        // Tell mediasoup client the connect step failed
        errback(error);
      }
    });

    // mediasoup fires "produce" when you call sendTransport.produce(...)
    // It needs the server to create the actual producer and return an id
    this.sendTransport.on('produce', async ({ kind, rtpParameters }, callback, errback) => {
      try {
        // Ask the server to create a producer on the server-side transport
        const result = await this.request('produce', {
          transportId: this.sendTransport.id,
          kind,
          rtpParameters
        });

        // If server failed, stop
        if (result?.error) throw new Error(result.error);

        // Pass the new producer id back into mediasoup client
        callback({ id: result.id });
      } catch (error) {
        // Tell mediasoup client this produce step failed
        errback(error);
      }
    });
  }

  async createRecvTransport() {
    // Ask the server to create a WebRTC transport meant for receiving media
    const data = await this.request('createWebRtcTransport', { direction: 'recv' });

    // Stop if server returned an error
    if (data?.error) throw new Error(data.error);

    // Create the browser-side receive transport using the server transport parameters
    this.recvTransport = this.device.createRecvTransport(data);

    // Same idea as send transport:
    // when mediasoup client wants to connect the recv transport,
    // forward the DTLS parameters to the server
    this.recvTransport.on('connect', async ({ dtlsParameters }, callback, errback) => {
      try {
        const result = await this.request('connectTransport', {
          transportId: this.recvTransport.id,
          dtlsParameters
        });

        // If server failed to connect it, stop
        if (result?.error) throw new Error(result.error);

        // Tell mediasoup client the recv transport is connected
        callback();
      } catch (error) {
        // Tell mediasoup client the recv transport connection failed
        errback(error);
      }
    });
  }

  async startMic() {
    // Ask the browser for microphone access
    // audio: true means capture mic audio
    // video: false means do not capture webcam video
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

    // Pull the first audio track out of that MediaStream
    const track = stream.getAudioTracks()[0];

    // Produce that audio track over the send transport
    // This triggers the sendTransport "produce" event above,
    // which then asks the server to create the real server-side producer
    this.micProducer = await this.sendTransport.produce({ track });

    // Return the original local stream in case UI wants it
    return stream;
  }

  async consumeExistingProducers() {
    // Ask the server for all producer IDs that already exist from OTHER peers
    // This is what lets a newly joined client hear users who were already connected
    const producerIds = await this.request('getProducers');

    // Consume each one, one by one
    for (const producerId of producerIds) {
      await this.consumeProducer(producerId);
    }
  }

  async consumeProducer(producerId) {
    console.log("consumed producer", producerId);

    // If we already made a consumer for this producer, do nothing
    // Prevents duplicate consumers and duplicate audio playback
    if (this.consumersByProducerId.has(producerId)) return;

    // Ask the server to create a consumer for this producer on our recv transport
    const data = await this.request('consume', {
      transportId: this.recvTransport.id,        // Which server-side recv transport to use
      producerId,                                // Which remote producer we want to receive
      rtpCapabilities: this.device.rtpCapabilities // What this client can receive
    });

    // Stop if the server says consuming is not possible
    if (data?.error) throw new Error(data.error);

    // Create the browser-side consumer using the parameters the server returned
    const consumer = await this.recvTransport.consume({
      id: data.id,
      producerId: data.producerId,
      kind: data.kind,
      rtpParameters: data.rtpParameters
    });

    // Store this consumer by producerId so we know we already consumed it
    this.consumersByProducerId.set(producerId, consumer);

    // Wrap the consumer's remote track in a normal browser MediaStream
    // This makes it easy to attach to an <audio> element
    const stream = new MediaStream([consumer.track]);

    // If the app provided a callback, hand the new remote stream back to it
    // Usually this is where UI code creates/updates an <audio> element
    if (typeof this.onRemoteStream === 'function') {
      console.log("calling onRemoteStream", producerId);
      this.onRemoteStream({ stream, producerId });
    }

    // The server created this consumer paused:true
    // Now that the client is ready and has the track, tell the server to resume it
    const resumeResult = await this.request('resumeConsumer', { consumerId: consumer.id });

    // Stop if resume failed
    if (resumeResult?.error) throw new Error(resumeResult.error);
  }
}
