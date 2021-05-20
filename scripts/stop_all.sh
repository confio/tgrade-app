#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"

"$SCRIPT_DIR/faucet/stop.sh" || true
"$SCRIPT_DIR/tgrade/stop.sh"
