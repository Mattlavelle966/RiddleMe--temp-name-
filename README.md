# Riddle-Me

This repository contains the **full development environment for the Riddle-Me project**, including both:

- the **backend server**
- the **client applications (test client + Expo app)**

The project is currently focused on building a **real-time communication platform** with:

- authenticated users
- auth outsourcing 
- user-to-user call setup
- mediasoup-based audio routing
- call rooms
- user SMS
- chat room SMS 

This repository represents the **foundation of the Riddle-Me**, where networking, authentication, and real-time communication are being built and validated together.

------

## Repository Structure

```
/server -> backend API + socket + mediasoup
/app -> Expo React Native client
```

------

## Overview

This project is a **self-hosted real-time communication backend** with a Expo, React Native frontend. It currently provides user authentication, live socket connections, and scoped voice calls between users.

The server handles **user registration and login (JWT-based)**, tracks which users are currently online by binding them to active sockets, and exposes basic API endpoints for user data and status.

For real-time communication, it uses **Socket.io for signaling** and **mediasoup for audio routing**. Users can initiate direct calls to one another, accept or decline incoming requests, and once connected, exchange audio within a **call-scoped session**.

------

## Backend (`/server`)

The backend is responsible for:

- HTTP API (Express)
- authentication and user management
- socket signaling (Socket.io)
- media routing (mediasoup)
- user <--> socket binding
- call scoping between users
- pending calls (calls waiting to be declined or answered)

------

### Core Responsibilities

- Node.js server startup
- REST API handling
- JWT authentication
- Socket authentication and binding
- Peer tracking (transports, producers, consumers)
- Call session routing (who can hear who)
- mediasoup worker/router management

------

## API Endpoints

All user-related routes are handled in `api/users.ts`. 

### Register

```
POST /api/register
curl -X POST http://localhost:3000/api/register \
-H "Content-Type: application/json" \
-d '{"username":"test","password":"test"}'
```

------

### Login

```
POST /api/login
```

Returns:

```
{
  "token": "JWT_TOKEN"
}
```

------

### Get Current User

```
GET /api/me
```

Requires:

```
Authorization: Bearer JWT_TOKEN
```

------

### Get All Users

```
GET /api/users
```

Returns list of registered users.

------

### Check User Status

```
GET /api/users/:userId/status
```

Returns:

```
{
  "online": true | false
}
```

This works by checking if a user currently has a bound socket.

------

## Authentication Model

The system uses **JWT-based authentication**.

```
token -> user identity
socket -> temporary connection
```

- Users authenticate via `/login`
- Token is stored client-side
- Socket connection sends token during handshake
- Backend verifies token and attaches:

```
(req as any).user = decoded
```

This allows:

- persistent identity
- disposable sockets
- clean reconnect behavior 

------

## Socket Layer

Sockets are authenticated using middleware before connection:

```
token verified
→ userId extracted
→ socket bound to userId
```

Internally:

```
userId <-> socketId
```

- One active socket per user (latest connection wins)
- Old sockets are replaced automatically
- On disconnect, mapping is removed

------

## Call Layer (Important)

This is the **major architectural addition**.

New Behavior

```
user A connects to user B
→ backend resolves user B's socket
→ backend creates call scope
→ only those sockets share producers
```

This means:

- no global broadcasting
- no accidental cross-talk
- communication is user-targeted

------

## mediasoup Layer

The mediasoup flow remains standard:

- create worker + router
- create send/recv transports
- produce audio (mic)
- consume remote producers

Key difference:

```
producer discovery is now scoped by call layer
```

------

### 2. Expo App (`/app`)

This is the **real frontend direction**.

Built with:

- React Native
- Expo

Responsibilities:

- login / register UI
- token storage
- backend URL input
- socket connection
- user list + status
- initiating calls

------

## Development Setup

You must run **two processes in development**.

### 1. Start Backend

```bash
cd server
npm install
npx tsx server.ts
```

------

### 2. Start Expo Client

```bash
cd testclient/app
npx expo start
```

------

## Important Development Notes

### Backend URL (CRITICAL)

In development, **clients must manually specify the backend URL**.

```bash
const API_BASE = "http://YOUR_PC_IP:3000";
```

Do NOT use:

```bash
localhost
```

when running on a phone — it will not work.

------

### Two Servers in Dev

In development:

```
Expo dev server (frontend)
+
Node backend server
```

In production:

```
user enters ONE server URL
→ app connects to that instance
```

The system is designed so that:

```
single server URL = full instance (API + socket + media)
```

------

## Architecture Philosophy

- backend-first development
- separate:
  - user identity (persistent)
  - socket connection (temporary)
- keep mediasoup layer unchanged, add logic around it
- evolve `app/` gradually

This approach ensures:

- each layer is independently testable
- bugs are easier to isolate
- system remains modular

------

## Current Features

- mediasoup SFU audio routing
- multi-peer audio support (scoped)
- SQLite database (persistent users)
- Drizzle ORM schema
- bcrypt password hashing
- JWT authentication
- protected API routes
- socket authentication
- user <--> socket binding
- user online/offline status
- user-to-user call initiation
- Expo-based mobile client (in progress)

------

## Current State

The system now supports:

```
authenticated users
+ user-aware sockets
+ scoped audio calls
```

------

## Notes

- mediasoup logic is stable and mostly unchanged
- most complexity now exists in:
  - auth layer
  - socket binding
  - call scoping
- frontend is still evolving

------

If someone is starting development on this repo, the key things to understand are:

```
1. auth layer (users + JWT)
2. socket binding (user <-> socket)
3. call layer (who is allowed to talk to who)
4. mediasoup flow (how audio actually moves)
```

Once those are understood, the rest of the system is straightforward to extend.
