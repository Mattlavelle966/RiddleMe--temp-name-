# Call System

## Overview

The call system introduces scoped communication.

Only users in a call can exchange audio.

------

## Call Flow

```text
User A clicks "Connect"
- backend finds User B socket
- call scope created
- both users join call
- audio exchange begins
```

------

## Detailed Flow

```text
connect request
- socket signaling
- call accepted/declined
- media initialization
- producers created
- consumers created
- audio playback
```

------

## Call Scope

A call scope is:

```text
callId : [socketA, socketB, ...]
```

This ensures:

- no global audio leaks
- no cross-talk
- targeted communication only

------

## Media Behavior

Inside a call:

- producers shared ONLY within scope
- consumers created ONLY for scoped users

------

## Important

Audio will NOT play unless:

```text
remote stream - attached to audio output
```

------

## Key Concept

```text
call scope = filter layer before mediasoup
```

------

## Summary

```text
user - socket - call - media
```