#!/usr/bin/env bash
set -euo pipefail

# Kill any process listening on the given port and run the dev:all script.
PORT=${1:-5173}

echo "Checking for processes on port ${PORT}..."
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -t -i:"${PORT}" || true)
else
  PIDS=$(ss -ltnp 2>/dev/null | awk -v port=":${PORT}" '$0 ~ port {print $NF}' | sed -n 's/.*pid=\([0-9]*\),.*/\1/p' || true)
fi

if [ -n "${PIDS}" ]; then
  echo "Killing processes on port ${PORT}: ${PIDS}"
  for pid in ${PIDS}; do
    kill "$pid" || true
  done
  # give the OS a moment to release the port
  sleep 0.5
else
  echo "No process found on port ${PORT}."
fi

echo "Starting dev:all..."
exec npm run dev:all
