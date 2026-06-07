#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "Stopping project dev servers (root=${ROOT})..."

PORTS=(5173 5000)
PIDS_TO_KILL=()

for port in "${PORTS[@]}"; do
  if command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -t -i:"${port}" -sTCP:LISTEN 2>/dev/null || true)
  else
    pids=$(ss -ltnp 2>/dev/null | awk -v port=":${port}" '$0 ~ port {print $NF}' | sed -n 's/.*pid=\([0-9]*\),.*/\1/p' || true)
  fi
  if [ -n "${pids}" ]; then
    echo "Found listeners on port ${port}: ${pids}"
    for pid in ${pids}; do
      PIDS_TO_KILL+=("$pid")
    done
  fi
done

while IFS= read -r line; do
  pid=$(awk '{print $1}' <<<"$line")
  cmd=${line#* }
  case "$cmd" in
    *Server.js*|*vite*|*concurrently*|*"npm --prefix server start"*)
      if [ -d "/proc/$pid" ]; then
        cwd=$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)
        if [ -n "$cwd" ] && { [ "$cwd" = "$ROOT" ] || [[ "$cwd" == "$ROOT/"* ]]; }; then
          PIDS_TO_KILL+=("$pid")
        fi
      fi
      ;;
  esac
done < <(ps -eo pid=,cmd=)

if [ ${#PIDS_TO_KILL[@]} -eq 0 ]; then
  echo "No matching processes found."
  exit 0
fi

unique_pids=($(printf "%s\n" "${PIDS_TO_KILL[@]}" | sort -u))

echo "Killing PIDs: ${unique_pids[*]}"
for pid in "${unique_pids[@]}"; do
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" && echo "Sent TERM to $pid" || true
  fi
done

sleep 0.5

for pid in "${unique_pids[@]}"; do
  if kill -0 "$pid" 2>/dev/null; then
    echo "PID $pid still alive, sending KILL"
    kill -9 "$pid" || true
  fi
done

echo "Stop script finished."
