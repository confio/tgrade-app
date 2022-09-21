#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck -x "$0"

# Link this to testnet's env file
source ./env.sh

echo "Tgrade home: $TGRADE_HOME"
echo "Chain id: $chainId"
echo "Nodel url: $nodeUrl"
echo "Correct? [y/N]:"
read -r A
[ "$A" != "y" ] && echo "Abort." && exit 1

# Keys for voting / execution (must be validators)
key="validator1-$chainSuffix"
otherKey1="validator2-$chainSuffix"
otherKey2="validator3-$chainSuffix"

# TODO: Automate, based on label
contractCodeId=18

# Get address
contractAddr=$(tgrade query wasm list-contract-by-code "$contractCodeId" -o json --node="$nodeUrl" | jq -r '.contracts[-1]')

echo "# Promote contract address $contractAddr"

# Try with a text proposal first
title="Promote $contractAddr to privileged"
description="Promote contract with address '$contractAddr' to privileged"
text_proposal=$(cat <<EOF
{"propose": {"title": "$title", "description": "$description", "proposal": {"text": {}} }}
EOF
)

# Prepare promotion proposal message
promotion_proposal=$(cat <<EOF
{ "propose": {
    "title": "$title",
    "description": "$description",
    "proposal": {
      "promote_to_privileged_contract": { "contract": "$contractAddr" }
    }
  }
}
EOF
)

valVotingContractAddr=$(tgrade q poe contract-address VALIDATOR_VOTING -o json --node="$nodeUrl" | jq -r '.address')

echo "Validator voting address: $valVotingContractAddr"
echo "Text proposal: $text_proposal"
echo "$contractAddr promotion proposal: $promotion_proposal"

echo
echo "Proceed? [y(es)/N(o)/t(ext)]: "
read -r A
[ "$A" = "y" ] || [ "$A" = "t" ] || exit

echo "Doing: $A"

if [ "$A" = "y" ]
then
  msg="$promotion_proposal"
else 
  msg="$text_proposal"
fi

echo "proposal: $msg"

rsp=$(tgrade tx wasm execute "$valVotingContractAddr" "$msg" \
  --from "$key" --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" "$keyringBackend" -b block -o json)

echo "$rsp"
proposal_id=$(echo "$rsp" | jq -r '.logs[0].events[-1].attributes[3].value')

# Vote
msg=$(cat <<EOF
{"vote": {"proposal_id": $proposal_id, "vote": "yes"}}
EOF
)
echo "-----------------------"
echo "Vote proposal: $msg"
echo "-----------------------"
echo "$otherKey1 votes yes:"
tgrade tx wasm execute \
  "$valVotingContractAddr" "$msg" \
  --from "$otherKey1" --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" "$keyringBackend" -b block -o json
echo "$otherKey2 votes yes:"
tgrade tx wasm execute \
  "$valVotingContractAddr" "$msg" \
  --from "$otherKey2" --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" "$keyringBackend" -b block -o json

# Check if passed
proposal_status=$(tgrade query wasm contract-state smart "$valVotingContractAddr" "{\"proposal\": { \"proposal_id\": $proposal_id }}" --node "$nodeUrl" -o json | jq -r '.data.status')
echo "Proposal $proposal_id status: $proposal_status"
[ "$proposal_status" != "passed" ] && echo "Proposal $proposal_id not passed" && exit 1

# Execute
msg=$(cat <<EOF
{"execute": {"proposal_id": $proposal_id}}
EOF
)
echo "-----------------------"
echo "Execute proposal: $msg"
echo "-----------------------"
tgrade tx wasm execute \
  "$valVotingContractAddr" "$msg" \
  --from "$key" --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" "$keyringBackend" -b block -o json

echo "--------------------------------------------------------------------------------------------"
echo "## $contractAddr promotion completed"
echo "--------------------------------------------------------------------------------------------"

# Verifications
echo "Check end blocker is called:"
echo "  1. Deposit some funds into the contract."
echo "  2. Check they get transferred to the engagement contract, on payment day / time"
