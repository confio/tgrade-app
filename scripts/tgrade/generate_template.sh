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
  tgrade testnet --v 2 --output-dir=/root --keyring-backend=test --chain-id=chain-JAynv8 --vesting-validators

# add tokens to faucet address
docker run --rm \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/root \
  "$REPOSITORY:$VERSION" \
  tgrade add-genesis-account tgrade1syn8janzh5t6rggtmlsuzs5w7qqfxqgld2dagk 1000000000utgd --home=/root/node0/tgrade

# add tokens to old system admin account
TEST_ACCOUNT_ADDR=tgrade1kalzk5cvq5yu6f5u73k7r905yw52sawckddsc3
docker run --rm \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/root \
  "$REPOSITORY:$VERSION" \
  tgrade add-genesis-account $TEST_ACCOUNT_ADDR 1000000000utgd --home=/root/node0/tgrade

# Tweak genesis config
# set engagement points
content=$(cat "$NODE_PATH"/config/genesis.json | jq  ".app_state.poe.seed_contracts.engagement |= . + [{\"address\":\"$TEST_ACCOUNT_ADDR\",\"points\":\"1000\"}]")
# set oversight community
content=$(echo "$content" | jq  ".app_state.poe.seed_contracts.oversight_community_members |= [\"$TEST_ACCOUNT_ADDR\"]")
# set arbiter
content=$(echo "$content" | jq  ".app_state.poe.seed_contracts.arbiter_pool_members |= [\"$TEST_ACCOUNT_ADDR\"]")
# set min fee
content=$(echo "$content" | jq  ".app_state.globalfee.params.minimum_gas_prices |= [{\"denom\":\"utgd\",\"amount\":\"0.05\"}]")
# give high EP to first validator
FIRST_VAL_ADDR=$(echo "$content"| jq  -r ".app_state.poe.seed_contracts.gen_txs[0].body.messages[0].operator_address")
content=$(echo "$content" | jq "(.app_state.poe.seed_contracts.engagement[] | select(.address == \"$FIRST_VAL_ADDR\") | .points) = \"1000\"")
# keep first gentx, delete the others
content=$(echo "$content" | jq  ".app_state.poe.seed_contracts.gen_txs |= [.[0]]")

mv "$NODE_PATH"/config/genesis.json  "$NODE_PATH"/config/genesis.json_old
echo "$content" > "$NODE_PATH/config/genesis.json"

# Clear peers
sed -i. 's/persistent_peers = \".*\"/persistent_peers = \"\"/' "$NODE_PATH/config/config.toml"


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
