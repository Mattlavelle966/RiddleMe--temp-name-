# Riddle-Me Backend

This repository contains the **backend server for the Riddle-Me project**.  
It is the starting point of what will hopefully eventually become the **full backend system for the platform**. The code here is early infrastructure that establishes the core networking and real-time communication layer the rest of the backend will build on.

---

## Repository Structure
​	`/server`
​	`/testclient`

---

### `/server`

This directory contains the **backend server implementation**.

Current responsibilities include:

- Running the Node.js server
- Managing peer connections
- Handling real-time signaling using **Socket.io**
- Managing media routing through **mediasoup**
- Tracking peers, transports, producers, and consumers

At the moment the server supports **basic peer-to-peer voice communication routed through the server using mediasoup**. This provides the foundation for future real-time features.

The server currently implements:

- mediasoup worker + router initialization
- WebRTC transport creation
- DTLS transport connection
- Producer creation (sending audio)
- Consumer creation (receiving audio)
- Peer tracking via a socket-ID keyed peer map

---

### `/testclient`

This directory contains a **minimal client used for testing the backend**.

This client exists strictly as a **development and testing tool**, not as a production client. Its purpose is to allow developers to:

- connect to the backend
- create transports
- produce audio
- consume audio from other peers
- verify server functionality
- verify any functionality that needs testing on the frontend

The test client will **continue to evolve as backend functionality grows**, allowing developers to quickly verify that changes have not introduced regressions.

The goal is to maintain a lightweight way to **exercise backend functionality without relying on a full application frontend** this way we can focus on one piece at a time.

---

## Current State

At this stage the backend supports:

- basic server startup
- peer tracking
- mediasoup router setup
- WebRTC transport negotiation
- simple voice communication between connected peers

This functionality serves as **the initial real-time communication layer for the backend**.

---

## Technologies

- **Node.js**
- **Socket.io** — signaling between client and server
- **mediasoup** — WebRTC media routing
- **Express** — static serving for the test client

---

## Notes

This repository represents the **early stages of the backend infrastructure**.  
The architecture and documentation will continue to evolve as additional backend systems are introduced.

The current goal is to establish a **stable foundation for real-time communication and peer management** that the rest of the project can build on.
