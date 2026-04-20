# Development Guide

## Running the Project

You must run two processes, run both with `dev.sh` or run each individually:

### Backend

```bash
cd server
npx tsx server.ts
```

### Expo App

```bash
cd app
npx expo start
```

------

## Backend Connection (IMPORTANT)

### Web (browser on same machine)

```bash
http://localhost:3000
```

------

### Mobile (real device)

```bash
http://YOUR_LAN_IP:3000
```

Example:

```bash
http://192.168.1.10:3000
```

`localhost` will NOT work on a phone
Use your computer’s LAN IP (expo will tell you yours when it runs correctly)

------

### Android Emulator

```bash
http://10.0.2.2:3000
```

------

## Development Setup

You are running:

```text
Expo dev server (frontend)
+
Node backend server
```

------

## Testing Flow

1. Start backend
2. Start Expo
3. Login/register
4. Verify users load
5. Check user status
6. Initiate call

------

## Common Issues

### Cannot connect from phone

- You used `localhost` (default)
- Fix - use your LAN IP (same IP you use in expo but with the backend server port)

------

### Socket not connecting

- Token missing or invalid
- Backend not running
- Wrong base URL

------

### Audio not playing (web only for now)

- Mobile calls not supported yet
- Browser autoplay blocked
- No `<audio>` element attached

------

## Dev Philosophy

- backend-first
- test with curl before UI
- isolate layers:
  - auth
  - sockets
  - calls
  - media