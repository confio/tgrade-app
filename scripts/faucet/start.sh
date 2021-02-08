#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

export FAUCET_CONCURRENCY=2
export FAUCET_MNEMONIC="cycle heart pair earn tenant access congress sense immune city winner hair"
# address: cosmos1pr5vxw69nndf0v9rswz7qqqd42s2e93ltc2cwk
export FAUCET_GAS_PRICE=0.025ucosm
export FAUCET_ADDRESS_PREFIX=wasm
export FAUCET_TOKENS=ucosm

DOCKER_HOST_IP=$(docker run --read-only --rm alpine ip route | awk 'NR==1 {print $3}')

docker run --read-only --rm \
  -e FAUCET_MNEMONIC \
  -e FAUCET_CONCURRENCY \
  -e FAUCET_GAS_PRICE \
  -e FAUCET_ADDRESS_PREFIX \
  -e FAUCET_TOKENS \
  -p 8000:8000 \
  --name "$CONTAINER_NAME" \
  "$REPOSITORY:$VERSION" \
  start "http://$DOCKER_HOST_IP:1319"
