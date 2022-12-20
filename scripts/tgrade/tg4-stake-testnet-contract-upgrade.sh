#!/bin/bash
set -o errexit -o nounset -o pipefail
command -v shellcheck >/dev/null && shellcheck -x "$0"

#set -x

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

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

poeContract="STAKING"
stakeContract="tg4_stake.wasm"

# Get stake address
stakeAddr=$(tgrade q poe contract-address "$poeContract" -o json --node="$nodeUrl" | jq -re '.address')

# Get stake code id
stakeCodeId=$(tgrade q wasm contract "$stakeAddr" -o json --node="$nodeUrl" | jq -re '.contract_info.code_id')
echo "* Original code id: $stakeCodeId"

stakeAddr=$(tgrade q wasm list-contract-by-code "$stakeCodeId" --node="$nodeUrl" -o json | jq -r '.contracts[0]')

echo "# Migrate $poeContract"
# Get contract version for reference
contractVersion=$(./get_contract_version.sh "$DIR/contracts/$stakeContract" | tail -1)
echo "New contract version: $contractVersion"
echo "## Upload new stake contract"
rsp=$(tgrade tx wasm store "$DIR/contracts/$stakeContract" \
  --from "$key" --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" "$keyringBackend" -b block -o json)
codeId=$(echo "$rsp" | jq -r '.logs[0].events[1].attributes[-1].value')
echo "* Code id: $codeId"

# Try with a text proposal first
title="Migrate $poeContract contract to code id $codeId"
description="Migrate '$poeContract' contract with address '$stakeAddr' to code id '$codeId' (version $contractVersion)"
text_proposal=$(cat <<EOF
{"propose": {"title": "$title", "description": "$description", "proposal": {"text": {}} }}
EOF
)

# Prepare migration proposal message
migrateMsg="{}"

upgrade_proposal=$(cat <<EOF
{ "propose":
  { "title": "$title",
    "description": "$description",
    "proposal": {
      "migrate_contract": {
        "contract": "$stakeAddr",
        "code_id": $codeId,
        "migrate_msg": "$(echo -n "$migrateMsg" | base64 -w0)"
      }
    }
  }
}
EOF
)

valVotingContractAddr=$(tgrade q poe contract-address VALIDATOR_VOTING -o json --node="$nodeUrl" | jq -r '.address')

echo "Validator voting address: $valVotingContractAddr"
echo "Text proposal: $text_proposal"
echo "$poeContract upgrade proposal: $upgrade_proposal"

echo
echo "Proceed? [y(es)/N(o)/t(ext)]: "
read -r A
[ "$A" = "y" ] || [ "$A" = "t" ] || exit

echo "Doing: $A"

if [ "$A" = "y" ]
then
  msg="$upgrade_proposal"
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
echo "## Stake migration completed"
echo "--------------------------------------------------------------------------------------------"

# Verifications

# Verify contract is set to new code id (for non-text proposal)
rsp=$(tgrade q wasm contract "$stakeAddr" -o json --node="$nodeUrl")
echo "$rsp" | jq .

newCodeID=$(echo "$rsp" | jq -r '.contract_info.code_id')
if [ "$A" = "y" ] && [ "$newCodeID" != "$codeId" ]
then
  echo "Unexpected code id: $newCodeID"
  exit 1
fi
