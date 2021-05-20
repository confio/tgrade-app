#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

# Please keep this in sync with the Ports overview in HACKING.md
TENDERMINT_PORT_GUEST="26657"
TENDERMINT_PORT_HOST="26657"
LCD_API_PORT_GUEST="1317"
LCD_API_PORT_HOST="1317"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

# Use a fresh volume for every start
docker volume rm -f tgrade_data
# docker pull "$REPOSITORY:$VERSION"

# This starts up tgrade
docker run --rm \
  --name "$CONTAINER_NAME" \
  -p "$TENDERMINT_PORT_HOST":"$TENDERMINT_PORT_GUEST" \
  -p "$LCD_API_PORT_HOST":"$LCD_API_PORT_GUEST" \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/template \
  --mount type=volume,source=tgrade_data,target=/root \
  "$REPOSITORY:$VERSION" \
  tgrade start --trace --home=/template/node0/tgrade 2>&1 | grep 'executed block'
