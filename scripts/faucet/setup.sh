#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

export FAUCET_ADDRESS_PREFIX=wasm

docker run --rm \
  -e FAUCET_ADDRESS_PREFIX \
  --name "$CONTAINER_NAME" \
  "$REPOSITORY:$VERSION" \
  generate
