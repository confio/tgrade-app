#!/bin/bash
set -ox errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck "$0"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

rm -rf "$SCRIPT_DIR/template"
mkdir "$SCRIPT_DIR/template"
NODE_PATH="$SCRIPT_DIR/template/node0/tgrade"

# The usage of the accounts below is documented in README.md of this directory
docker run --rm \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/root \
  "$REPOSITORY:$VERSION" \
  tgrade testnet --v 1 --vesting-validators --output-dir=/root --keyring-backend=test --chain-id=chain-JAynv8

# add tokens to faucet address
docker run --rm \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/root \
  "$REPOSITORY:$VERSION" \
  tgrade add-genesis-account tgrade1syn8janzh5t6rggtmlsuzs5w7qqfxqgld2dagk 1000000000utgd --home=/root/node0/tgrade

# add tokens to old system admin account
docker run --rm \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/root \
  "$REPOSITORY:$VERSION" \
  tgrade add-genesis-account tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3 1000000000utgd --home=/root/node0/tgrade


# The ./template folder is created by the docker daemon's user (root on Linux, current user
# when using Docker Desktop on macOS), let's make it ours if needed
if [ ! -x "$NODE_PATH/config" ]; then
  sudo chown -R "$(id -u):$(id -g)" "$SCRIPT_DIR/template"
fi

function inline_jq() {
  IN_OUT_PATH="$1"
  shift
  TMP_DIR=$(mktemp -d "${TMPDIR:-/tmp}/inline_jq.XXXXXXXXX")
  TMP_FILE="$TMP_DIR/$(basename "$IN_OUT_PATH")"
  jq "$@" <"$IN_OUT_PATH" >"$TMP_FILE"
  if ! mv "$TMP_FILE" "$IN_OUT_PATH"; then
    echo >&2 "Temp file '$TMP_FILE' could not be deleted. If it contains sensitive data, you might want to delete it manually."
    exit 3
  fi
}

(
  cd "$SCRIPT_DIR"
  # Sort genesis
  inline_jq "$NODE_PATH/config/genesis.json" -S

  # Custom settings in config.toml
  sed -i "" \
    -e 's/^cors_allowed_origins =.*$/cors_allowed_origins = ["*"]/' \
    -e 's/^enabled = false$/enabled = true/' \
    -e 's/^timeout_propose =.*$/timeout_propose = "300ms"/' \
    -e 's/^timeout_propose_delta =.*$/timeout_propose_delta = "100ms"/' \
    -e 's/^timeout_prevote =.*$/timeout_prevote = "300ms"/' \
    -e 's/^timeout_prevote_delta =.*$/timeout_prevote_delta = "100ms"/' \
    -e 's/^timeout_precommit =.*$/timeout_precommit = "300ms"/' \
    -e 's/^timeout_precommit_delta =.*$/timeout_precommit_delta = "100ms"/' \
    -e 's/^timeout_commit =.*$/timeout_commit = "1s"/' \
    "$NODE_PATH/config/config.toml"

  # Custom settings app.toml
  sed -i "" \
    -e 's/^enable =.*$/enable = true/' \
    -e 's/^enabled-unsafe-cors =.*$/enabled-unsafe-cors = true/' \
    "$NODE_PATH/config/app.toml"
)
