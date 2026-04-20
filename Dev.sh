#!/usr/bin/env bash
trap "kill 0" EXIT

echo "[dev] installing server deps..."
#change address for dev enviromentus as needed 
( cd server && npm install)

echo "[dev] installing app deps..."
(cd app && npm install)

(cd server && MEDIASOUP_ANNOUNCED_ADDRESS=192.168.40.54 npx tsx server.ts 2>&1 | sed 's/^/[server] /') &

sleep 2

cd app && npx expo start
