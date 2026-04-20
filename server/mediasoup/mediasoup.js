const mediasoup = require('mediasoup');     
//
const ANNOUNCED_ADDRESS = process.env.MEDIASOUP_ANNOUNCED_ADDRESS || "127.0.0.1";
console.log(`Path:${ANNOUNCED_ADDRESS}`);

//worker handles real time transport protocol for media both audio and video,
//real time communication, interactive connectivity establishment, how peers can connect through the Nat 
//datagram transport layer security encrypts media connection
let worker;
// mediasoup router producer -> transport -> router -> transport -> consumer 
let router;

async function createWorkerAndRouter() {
  // Create the mediasoup worker
  // The worker handles the underlying media engine
  // RTC real time communication
  worker = await mediasoup.createWorker({
    logLevel: 'warn',
    rtcMinPort: 40000,
    rtcMaxPort: 40100
  });

  // Create a router on that worker
  // The router defines what codecs are supported and is the handler of media flow, 
  // basically telling server how to talk with the client  
  router = await worker.createRouter({
    mediaCodecs: [
      {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2
      }
    ]
  });

  console.log('mediasoup ready');
}

async function createTransport() {
  // Create a WebRTC transport on the router
  // A transport is the network path a client uses to send or receive media
  const transport = await router.createWebRtcTransport({
    listenInfos: [
      {
        protocol: 'udp',
        ip: '0.0.0.0',
        // Address given back to the client
        announcedAddress: ANNOUNCED_ADDRESS,
        portRange: { min: 40000, max: 40100 }
      },
      {
        // Also allow TCP fallback
        protocol: 'tcp',
        ip: '0.0.0.0',
        announcedAddress: ANNOUNCED_ADDRESS,
        portRange: { min: 40000, max: 40100 }
      }
    ],
    enableUdp: true,                        
    enableTcp: true,                        
    // Prefer UDP when possible
    preferUdp: true
  });

  return transport;
}

function getRouter() {
  return router;
}

module.exports = {
  createWorkerAndRouter,
  createTransport,
  getRouter
};
