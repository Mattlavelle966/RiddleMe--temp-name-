# Architecture Overview

## System Layers

```text
Client (Expo / Web)
- API (Express)
- Socket Layer (Socket.io)
- Call Layer (scoping)
- Media Layer (mediasoup)
```

------

## Authentication Layer

- JWT-based authentication
- Token issued on login
- Stored client-side
- Sent during socket handshake

```text
token - user identity
```

------

## Socket Layer

- Socket authenticated on connection
- User bound to socket:

```text
userId - socketId
```

- One active socket per user
- Reconnect replaces old socket

------

## Call Layer (Key Concept)

This layer controls **who can communicate**.

```text
user A connects to user B
- backend creates call scope
- only those users share audio
```

------

## Media Layer (mediasoup)

Standard Selective Forwarding flow:

- create worker + router
- create transports
- produce audio
- consume remote audio

Key change:

```text
audio producer discovery is scoped by call
```

------

## Data Flow

```text
login - JWT
- socket connect (auth)
- bind user - socket
- user initiate's call
- create call scope
- exchange media
```

##  Design Principles

- separate identity from connection
- sockets are disposable
- media layer unchanged
- logic added around mediasoup

------

## Summary

```text
auth - who you are
socket - where you are
call scope - who you talk to
media - how audio moves
```