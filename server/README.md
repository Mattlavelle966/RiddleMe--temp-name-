# Riddle-Me Server

This directory contains the **backend server implementation** for the Riddle-Me project.

The server currently provides the **real-time communication layer** used for peer connections and voice communication. It is the core foundation that future backend systems will build on.

## Responsibilities

The server currently handles:

- Node.js server startup
- Peer connection management
- Real-time signaling using **Socket.io**
- Media routing using **mediasoup**
- Tracking peers, transports, producers, and consumers

## Current Features

- mediasoup worker + router initialization
- WebRTC transport creation
- DTLS transport connection
- Producer creation (sending audio)
- Consumer creation (receiving audio)
- Peer tracking using a socket ID keyed peer map

At this stage the server supports **basic peer-to-peer voice communication routed through the server using mediasoup**.

More backend systems and services will be added here as development continues.
