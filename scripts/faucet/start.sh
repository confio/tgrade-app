#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

export FAUCET_CONCURRENCY=2
export FAUCET_MNEMONIC="now mesh clog card twin rather knee head fancy matrix sponsor pill"
# address: wasm1syn8janzh5t6rggtmlsuzs5w7qqfxqglvk5k0d
export FAUCET_GAS_PRICE=0.025ucosm
export FAUCET_ADDRESS_PREFIX=wasm
export FAUCET_TOKENS=ucosm

# docker pull "$REPOSITORY:$VERSION"

docker run --read-only --rm \
  -e FAUCET_MNEMONIC \
  -e FAUCET_CONCURRENCY \
  -e FAUCET_GAS_PRICE \
  -e FAUCET_ADDRESS_PREFIX \
  -e FAUCET_TOKENS \
  --name "$CONTAINER_NAME" \
  --network=host \
  "$REPOSITORY:$VERSION" \
  start http://localhost:26657
