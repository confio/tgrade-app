#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

# Link this to testnet's env file
#source ./env.sh

echo "Tgrade home: $TGRADE_HOME"
echo "Chain id: $chainId"
echo "Nodel url: $nodeUrl"
echo "Correct? [y/N]:"
read A
[ "$A" != "y" ] && echo "Abort." && exit 1

key="tgrade-v5-reserve-internal-14"
#key="burner3-mainnet-1"

contract="tfi_factory"

# TODO: Autodetect
pairCodeId=16
cw20CodeId=13

# Instantiate a tfi-factory contract
# 1. Store contract
rsp=$(tgrade tx wasm store "$DIR/contracts/$contract.wasm" \
  --from $key --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend")
codeID=$(echo "$rsp" | jq -er '.logs[0].events[1].attributes[-1].value')
echo "Tfi-factory Code Id: $codeID"
if echo "$0" | grep -q '/store[_-]'
then
  exit 0
fi

keyAddr=$(tgrade keys show "$key" "$keyringBackend" | grep address: | cut -f4 -d\ )

# 2. Instantiate tfi-factory contract
initMsg="{
  \"pair_code_id\": $pairCodeId,
  \"token_code_id\": $cw20CodeId
}"
rsp=$(tgrade tx wasm instantiate $codeID "$initMsg" --label "tfi-factory" --admin "$keyAddr" --from $key --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend")

address=$(echo "$rsp" | jq -er '.logs[0].events[0].attributes[0].value')
echo "Tfi-factory Address: $address"
