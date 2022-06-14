#!/bin/bash
set -ox errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

PUBKEY=$(docker run --rm \
         --mount type=bind,source="$SCRIPT_DIR/template",target=/root \
         "$REPOSITORY:$VERSION" \
          tgrade tendermint show-validator --home=/root/node1/tgrade)

DOCKER_HOST_IP=$(docker run --read-only --rm alpine ip route | awk 'NR==1 {print $3}');

docker run --rm \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/root \
  "$REPOSITORY:$VERSION" \
   tgrade tx poe create-validator \
          --amount=1000utgd \
          --vesting-amount=1000utgd \
          --from=node1 \
          --pubkey="$PUBKEY" \
          --chain-id=tgrade-patchnet-1 \
      --moniker="delme" \
      --fees=50000utgd \
      --gas=250000 \
      --home=/root/node1/tgrade \
      --keyring-backend=test \
      --chain-id=chain-JAynv8 \
      --node="http://$DOCKER_HOST_IP:26657" \
      -y -b block
