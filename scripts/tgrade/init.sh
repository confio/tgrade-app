#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"

#
# CosmWasm init
#
"$SCRIPT_DIR/deploy_contracts.mjs"
"$SCRIPT_DIR/instantiate_factory.mjs"
