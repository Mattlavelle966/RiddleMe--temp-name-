#!/usr/bin/env bash
trap "kill 0" EXIT

(cd server && npx tsx server.ts 2>&1 | sed 's/^/[server] /') &

sleep 2

cd app && npx expo start
