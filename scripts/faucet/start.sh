#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

export FAUCET_CONCURRENCY=2
export FAUCET_MNEMONIC="now mesh clog card twin rather knee head fancy matrix sponsor pill"
# address: tgrade1syn8janzh5t6rggtmlsuzs5w7qqfxqgld2dagk
export FAUCET_GAS_PRICE=0.05utgd
export FAUCET_ADDRESS_PREFIX=tgrade
export FAUCET_TOKENS=utgd
export FAUCET_GAS_LIMIT=100000

# docker pull "$REPOSITORY:$VERSION"

DOCKER_HOST_IP=$(docker run --read-only --rm alpine ip route | awk 'NR==1 {print $3}');
docker run --read-only --rm \
  -e FAUCET_MNEMONIC \
  -e FAUCET_CONCURRENCY \
  -e FAUCET_GAS_PRICE \
  -e FAUCET_ADDRESS_PREFIX \
  -e FAUCET_TOKENS \
  -e FAUCET_GAS_LIMIT \
  --name "$CONTAINER_NAME" \
  -p 8000:8000 \
  "$REPOSITORY:$VERSION" \
  start "http://$DOCKER_HOST_IP:26657"
