#!/bin/bash
set -o errexit -o nounset -o pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

#------------------
home_dir=t"$HOME/.tgrade"

# Keys: Use `tgrade key add --recover` to add at least two validators
key="validator-2"
otherKey="validator-1"

# Data from https://confio.slab.com/posts/tgrade-internal-9-d7azqque
chainId="tgrade-internal-9"
nodeUrl="https://rpc.internal-9.tgrade.io:443"
factoryCodeId=11

factoryContractAddress=$(tgrade q wasm list-contract-by-code $factoryCodeId --node=$nodeUrl -o json  | jq -r  '.contracts[0]')

echo "--------------------------------------------------------------------------------------------"
echo " "
echo " # Part III: Migrate tfi factory"
echo " "
echo "--------------------------------------------------------------------------------------------"

echo "## Upload new tfi factory contract"
rsp=$(tgrade tx wasm store "$DIR/contracts/patched_tfi_factory.wasm" \
  --from $key --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json)
codeID=$(echo "$rsp" | jq -er '.logs[0].events[1].attributes[-1].value')
echo "* Code id: $codeID"

# Try with a text proposal first
title="Migrate tfi factory contract to code id $codeID"
description="Migrate tfi factory contract with address '$factoryContractAddress' to code id '$codeID'"
text_proposal=$(cat <<EOF
{"propose": {"title": "$title", "description": "description", "proposal": {"text": {}} }}

EOF
)

# Prepare migration proposal message
upgrade_proposal=$(cat <<EOF
{"propose": {"title": "$title", "description": "$description", "proposal": {"migrate_contract": {"contract":"$factoryContractAddress", "code_id": $codeID, "migrate_msg": "$(echo -n '{}' | base64)"}} }}

EOF
)

valVotingContractAddr=$(tgrade q poe contract-address VALIDATOR_VOTING -o json --node="$nodeUrl" | jq -re ".address")

echo "Text proposal: $text_proposal"
echo "tfi-factory upgrade proposal: $upgrade_proposal"
echo "validator voting address: $valVotingContractAddr"

echo
echo "Proceed? [y/N/t]: "
read A
[ "$A" = "y" -o "$A" = "t" ] || exit

echo "Doing: $A"

if [ "$A" = "y" ]
then
  msg="$upgrade_proposal"
else 
  msg="$text_proposal"
fi

echo "proposal: $msg"

rsp=$(tgrade tx wasm execute "$valVotingContractAddr" "$msg" \
      --from $key --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json)

echo $rsp
proposal_id=$(echo "$rsp" | jq -er '.logs[0].events[-1].attributes[3].value')

msg=$(cat << EOF
{"vote": {"proposal_id": $proposal_id, "vote": "yes"}}
EOF
)
echo "-----------------------"
echo "Vote proposal: $msg"
echo "-----------------------"
tgrade tx wasm execute  \
  "$valVotingContractAddr" "$msg" \
  --from $otherKey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json
msg=$(cat << EOF
{"execute": {"proposal_id": $proposal_id}}
EOF
)

# Check if passed
proposal_status=$(tgrade query wasm contract-state smart $valVotingContractAddr "{\"proposal\": { \"proposal_id\": $proposal_id }}" --node $nodeUrl -o json | jq -er .data.status)
echo "Proposal $proposal_id status: $proposal_status"

echo "-----------------------"
echo "Execute proposal: $msg"
echo "-----------------------"
tgrade tx wasm execute  \
  "$valVotingContractAddr" "$msg" \
  --from $key --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json

echo "--------------------------------------------------------------------------------------------"
echo "## TFI factory migration completed"
echo "--------------------------------------------------------------------------------------------"
rsp=$(tgrade q wasm contract $factoryContractAddress -o json --node="$nodeUrl")
echo "$rsp"
newCodeID=$(echo "$rsp" | jq -re ".contract_info.code_id")
if [ "$newCodeID" != "$codeID" ]; then
   echo "Unexpected code id: $newCodeID";
   exit 1;
fi
