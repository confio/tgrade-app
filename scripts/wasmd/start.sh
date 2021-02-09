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
docker volume rm -f wasmd_data
# docker pull "$REPOSITORY:$VERSION"

# This starts up wasmd
docker run --rm \
  --name "$CONTAINER_NAME" \
  -p "$TENDERMINT_PORT_HOST":"$TENDERMINT_PORT_GUEST" \
  -p "$LCD_API_PORT_HOST":"$LCD_API_PORT_GUEST" \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/template \
  --mount type=volume,source=wasmd_data,target=/root \
  "$REPOSITORY:$VERSION" \
  ./run_wasmd.sh /template 2>&1 | grep 'Executed block'
