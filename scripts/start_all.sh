#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"

# start up the blockchain and wait for it
"$SCRIPT_DIR/wasmd/start.sh" &
echo "Wait for wasmd to start..."
timeout 60 bash -c "until curl -s http://localhost:26657/validators?height=3 | grep -q block_height; do echo ...; sleep 0.5; done"
echo "3 blocks produced!"

"$SCRIPT_DIR/faucet/start.sh" &
echo "Wait for faucet to start up..."
timeout 60 bash -c "until curl -s http://localhost:8000/status > /dev/null; do sleep 0.5; done"
sleep 1

"$SCRIPT_DIR/wasmd/init.sh"

echo "All systems go - start your webapp!"

# stay alive forever until the CI kills us
if [ -n "${CI:-}" ]; then
  tail -f /dev/null
  echo "Shutting down!"
fi
