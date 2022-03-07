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

NEW_VERSION="v0.7.0"
UPGRADE_NAME="v07"
UPGRADE_HEIGHT_OFFSET=1000 # ~1000 blocks after the current block
#------------------

currentHeight=$(tgrade status --node $nodeUrl | jq -re ".SyncInfo.latest_block_height")
upgradeHeight=$(echo "scale=0; ($currentHeight + $UPGRADE_HEIGHT_OFFSET * 1.5) / 1000 * 1000" | bc -l)
haltHeight=$[upgradeHeight - 1]

factoryContractAddress=$(tgrade q wasm list-contract-by-code $factoryCodeId --node=$nodeUrl -o json  | jq -r  '.contracts[0]')

echo "--------------------------------------------------------------------------------------------"
echo " "
echo "# Part II: Upgrade chain "
echo " "
echo "--------------------------------------------------------------------------------------------"
echo "## Ensure tfi factory contract exists"
tgrade q wasm contract $factoryContractAddress -o json --node="$nodeUrl" | jq

echo "Current height: $currentHeight"
echo "Upgrade height: $upgradeHeight"
echo "Halt height   : $haltHeight"

# Try with a text proposal first
text_proposal=$(cat << EOF
{"propose": {"title": "Test", "description": "Upgrade to $NEW_VERSION pre-test using text", "proposal": {"text": {}} }}
EOF
)

upgrade_proposal=$(cat << EOF
{"propose": {"title": "Upgrade", "description": "Upgrade to $NEW_VERSION", "proposal": {"register_upgrade": {"name":"$UPGRADE_NAME", "height": $upgradeHeight, "info": "$factoryContractAddress"}} }}
EOF
)

valVotingContractAddr=$(tgrade q poe contract-address VALIDATOR_VOTING -o json --node="$nodeUrl" | jq -re ".address")

echo "Text proposal: $text_proposal"
echo "Add new upgrade proposal: $upgrade_proposal"
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
echo "## Remember to stop chain at height: $haltHeight, and replace binaries!"
echo "--------------------------------------------------------------------------------------------"
echo "Current height: $(tgrade status --node="$nodeUrl" |jq -re ".SyncInfo.latest_block_height" )"
