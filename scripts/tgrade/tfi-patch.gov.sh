#!/bin/bash
set -ox errexit -o nounset -o pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"


#chainId=tgrade-patchnet-1
#testnet=patchnet-1.tgrade.io
#nodeUrl=https://rpc.$testnet:443

chainId=chain-JAynv8
nodeUrl=tcp://localhost:26657
factoryContractAddress="tgrade1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6sd9g4hg"


work_dir=$(mktemp -d)
home_dir="$work_dir/home"
mkdir -p "$home_dir"

if ! $(tgrade keys show mykey --home="$home_dir" --keyring-backend=test); then
  echo "## Restore the accounts"
  tgrade keys add mykey --recover  --home="$home_dir" --keyring-backend=test
fi


echo "-----------------------"
echo "## Add new CosmWasm contract"
rsp=$(tgrade tx wasm store "$DIR/contracts/patched_tfi_factory.wasm" \
  --from mykey --gas 1700000 --gas-prices=0.1utgd -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json --home="$home_dir" --keyring-backend=test)

echo "$rsp"
code_id=$(echo "$rsp" | jq -er '.logs[0].events[1].attributes[-1].value')
echo "* Code id: $code_id"
echo "-----------------------"
echo "## Add migration gov proposal"
targetContract=$(tgrade q poe contract-address VALIDATOR_VOTING -o json --node="$nodeUrl" | jq -re ".address")
title="Migrate TFI factory to code id $code_id"
description="Migrate TFI factory contract with addresss '$targetContract' to code id '$code_id'"

msg=$(cat << EOF
{"propose": {"title": "$title", "description": "$description", "proposal": {"migrate_contract": {"contract":"$factoryContractAddress", "code_id": $code_id, "migrate_msg": "e30K"}} }}
EOF)

echo "-----------------------"
echo "Submit proposal: $msg"
echo "-----------------------"


tgrade tx wasm execute  \
  "$targetContract" "$msg" \
  --from mykey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.01 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json \
  --home="$home_dir" --keyring-backend=test


rm -rf ${work_dir}

