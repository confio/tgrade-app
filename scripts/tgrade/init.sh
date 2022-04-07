#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"

# Deploy contracts
"$SCRIPT_DIR/deploy_contracts.mjs"
# Query and load validator voting contract's address
VALIDATOR_VOTING_ADDRESS="$(curl http://localhost:1317/tgrade/poe/v1beta1/contract/VALIDATOR_VOTING | jq -r '.address')"
# Instantiate factory with validator voting contract's address as migrator
VALIDATOR_VOTING_ADDRESS=$VALIDATOR_VOTING_ADDRESS "$SCRIPT_DIR/instantiate_factory.mjs"
