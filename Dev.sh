#!/usr/bin/env bash
trap "kill 0" EXIT

echo "[dev] installing server deps..."
(cd server && npm install)

echo "[dev] installing app deps..."
(cd app && npm install)

(cd server && npx tsx server.ts 2>&1 | sed 's/^/[server] /') &

sleep 2

cd app && npx expo start
