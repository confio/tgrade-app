#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"

# start up the blockchain and wait for it
"$SCRIPT_DIR/tgrade/start.sh" &
echo "Wait for tgrade to start..."
timeout 60 bash -c "until curl -s http://localhost:26657/validators?height=3 | grep -q block_height; do echo ...; sleep 0.5; done"
echo "3 blocks produced!"

"$SCRIPT_DIR/faucet/start.sh"

