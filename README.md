# Riddle-Me

Riddle-Me is a **self-hosted real-time communication platform** built with:

- Node.js (Express backend)
- Socket.io (real-time signaling)
- mediasoup (audio routing / SFU)
- Expo React Native (mobile client)

The project currently supports **authenticated users, real-time connections, and scoped voice calls between users**.

------

## Quick Start

### 1. Start Backend & Expo App

```bash
./Dev.sh
```

### 2. Start Expo App

```bash
cd app
npx expo start
```

### 3. Start Backend

```bash
cd server
npm install
npx tsx server.ts
```

------

## Connecting to the Backend

- **Web (same machine):**

  ```bash
  http://localhost:3000
  ```

- **Mobile (real device):**

  ```bash
  http://YOUR_LAN_IP:3000
  ```

  (Example: `http://192.168.1.10:3000`)

Do NOT use `localhost` on a phone — it will not work.

------

## Project Structure

```text
/server - backend API + socket + mediasoup
/app - Expo React Native client
/docs - documentation
```

------

## Current Features

- User registration & login (JWT)
- Authenticated socket connections
- User online/offline status
- User-to-user call setup
- Scoped audio calls (no global broadcast)
- mediasoup SFU audio routing

------

- ## Documentation

  - [Development Guide](docs/development.md)
  - [Architecture Overview](docs/architecture.md)
  - [API Reference](docs/api.md)
  - [Call System](docs/calls.md)

------

## Core Idea

```text
token - user identity
socket - temporary connection
call scope - who can talk to who
```

------

## Current State

```text
authenticated users
+ user-aware sockets
+ scoped audio calls
```

The system is stable at the backend level.
Frontend and mobile media support are still evolving.

------
