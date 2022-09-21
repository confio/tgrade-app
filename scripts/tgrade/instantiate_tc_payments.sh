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

contract="tgrade_tc_payments"

# Instantiate contract
# 1. Store contract
rsp=$(tgrade tx wasm store "$DIR/contracts/$contract.wasm" \
  --from $key --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend")
codeID=$(echo "$rsp" | jq -er '.logs[0].events[1].attributes[-1].value')

echo "Code Id: $codeID"
if echo $0 | grep -q store_
then
  exit 0
fi

keyAddr=$(tgrade keys show "$key" "$keyringBackend" | grep address: | cut -f4 -d\ )

# 2. Instantiate contract
# Validator voting address (migrate admin)
valVotingAddr=$(tgrade q poe contract-address VALIDATOR_VOTING -o json --node="$nodeUrl" | jq -re ".address")
# OC proposals address
ocProposalsAddr=$(tgrade q poe contract-address OVERSIGHT_COMMUNITY_PROPOSALS -o json --node="$nodeUrl" | jq -re ".address")
# OC address
ocAddr=$(tgrade q poe contract-address OVERSIGHT_COMMUNITY -o json --node="$nodeUrl" | jq -re ".address")
# AP address
apAddr=$(tgrade q poe contract-address ARBITER_POOL -o json --node="$nodeUrl" | jq -re ".address")
# Engagegement address
engagementAddr=$(tgrade q poe contract-address ENGAGEMENT -o json --node="$nodeUrl" | jq -re ".address")

initMsg="{
  \"admin\": \"$ocProposalsAddr\",
  \"oc_addr\": \"$ocAddr\",
  \"ap_addr\": \"$apAddr\",
  \"engagement_addr\": \"$engagementAddr\",
  \"denom\": \"utgd\",
  \"payment_amount\": \"100000000\",
  \"payment_period\": { \"monthly\": {} }
}"
echo "$initMsg" | jq '.'
rsp=$(tgrade tx wasm instantiate $codeID "$initMsg" --label "$contract" --admin "$valVotingAddr" --from $key --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend")

address=$(echo "$rsp" | jq -er '.logs[0].events[0].attributes[0].value')
echo "$contract instance address: $address"
