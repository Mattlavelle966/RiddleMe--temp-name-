# Riddle-Me Server

This directory contains the **backend server implementation** for the Riddle-Me project.

## How to Run

From the `server/` directory:

```bash 
npm install
npx tsx server.ts
```

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
- SQLite database for persistent user accounts
- Drizzle ORM schema for user storage
- User authentication endpoints (`/api/register`, `/api/login`)
- JWT token authentication middleware
- Token Protected API routes (example: `/api/me`)

At this stage the server supports **basic multi-peer voice communication using a mediasoup SFU**, along with **persistent user account storage and authentication** through **SQLite, Drizzle ORM, register/login endpoints, JWT middleware, and protected API routes**. Audio is sent from each client to the server, which then forwards the relevant streams to the other connected peers.

More backend systems and services will be added here as development continues.
