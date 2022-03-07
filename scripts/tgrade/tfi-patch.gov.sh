#!/bin/bash
set -o errexit -o nounset -o pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"


#chainId=tgrade-patchnet-1
#testnet=patchnet-1.tgrade.io
#nodeUrl=https://rpc.$testnet:443

#------------------
chainId=chain-JAynv8
nodeUrl=tcp://localhost:26657
factoryContractAddress="tgrade1fventeva948ue0fzhp6xselr522rnqwger9wg7r0g9f4jemsqh6sd9g4hg"
upgradeHeight=30
NEW_VERSION="v0.7.0"
#------------------

work_dir=$(mktemp -d)
home_dir="$work_dir/home"
mkdir -p "$home_dir"

if ! $(tgrade keys show mykey --home="$home_dir" --keyring-backend=test); then
  echo "## Restore the accounts"
  echo "For local testing, see seed phrase in: scripts/tgrade/template/node0/tgrade/key_seed.json"
  tgrade keys add mykey --recover  --home="$home_dir" --keyring-backend=test
fi

echo "--------------------------------------------------------------------------------------------"
echo " "
echo "# Part I: Setup chain system under test"
echo " "
echo "--------------------------------------------------------------------------------------------"
echo "## Start old tgrade version"

TENDERMINT_PORT_GUEST="26657"
TENDERMINT_PORT_HOST="26657"
LCD_API_PORT_GUEST="1317"
LCD_API_PORT_HOST="1317"

SCRIPT_DIR="$(realpath "$(dirname "$0")")"
# shellcheck source=./env
# shellcheck disable=SC1091
source "$SCRIPT_DIR"/env

# Use a fresh volume for every start
docker rm -f tgrade faucet
docker volume rm -f tgrade_data

haltHeight=$((upgradeHeight-1))
# This starts up old tgrade as deamon
docker run --rm -d \
  --name "tgrade" \
  -p "$TENDERMINT_PORT_HOST":"$TENDERMINT_PORT_GUEST" \
  -p "$LCD_API_PORT_HOST":"$LCD_API_PORT_GUEST" \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/template \
  --mount type=volume,source=tgrade_data,target=/root \
  "$REPOSITORY:$VERSION" \
  /bin/sh -c "cp -r /template/node0/tgrade /root; tgrade unsafe-reset-all --home=/root/tgrade ; tgrade start --trace --home=/root/tgrade --halt-height=$haltHeight 2>&1"

sleep 5 # give container some start up time
echo "## Start faucet"
"$SCRIPT_DIR/../faucet/start.sh" &
echo "Wait for faucet to start up..."
timeout 60 bash -c "until curl -s http://localhost:8000/status > /dev/null; do sleep 0.5; done"

"$SCRIPT_DIR/deploy_contracts.mjs"
"$SCRIPT_DIR/instantiate_factory.mjs"

echo "--------------------------------------------------------------------------------------------"
echo " "
echo "# Part II: Upgrade chain "
echo " "
echo "--------------------------------------------------------------------------------------------"
echo "## Ensure tfi factory contract exists"
tgrade q wasm contract $factoryContractAddress -o json --node="$nodeUrl" | jq

msg=$(cat << EOF
{"propose": {"title": "Upgrade", "description": "Upgade to v0.7.0", "proposal": {"register_upgrade": {"name":"v07", "height": $upgradeHeight, "info": "$factoryContractAddress"}} }}
EOF
)

echo "-----------------------"
echo "## Add new upgrade proposal: $msg"
valVotingContractAddr=$(tgrade q poe contract-address VALIDATOR_VOTING -o json --node="$nodeUrl" | jq -re ".address")

rsp=$(tgrade tx wasm execute "$valVotingContractAddr" "$msg" \
      --from mykey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json \
      --home="$home_dir" --keyring-backend=test)

echo $rsp
proposal_id=$(echo "$rsp" | jq -er '.logs[0].events[-1].attributes[3].value')

# Voting not supported with 1 validator community member
#msg=$(cat << EOF
#{"vote": {"proposal_id": $proposal_id, "vote": "yes"}}
#EOF
#)
#echo "-----------------------"
#echo "Vote proposal: $msg"
#echo "-----------------------"
#tgrade tx wasm execute  \
#  "$valVotingContractAddr" "$msg" \
#  --from mykey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json \
#  --home="$home_dir" --keyring-backend=test

msg=$(cat << EOF
{"execute": {"proposal_id": $proposal_id}}
EOF
)

echo "-----------------------"
echo "Execute proposal: $msg"
echo "-----------------------"

tgrade tx wasm execute  \
  "$valVotingContractAddr" "$msg" \
  --from mykey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json \
  --home="$home_dir" --keyring-backend=test

echo "--------------------------------------------------------------------------------------------"
echo "## Wait for chain to stop at height: $upgradeHeight"
echo "--------------------------------------------------------------------------------------------"
echo "Current height: $(tgrade status --node="$nodeUrl" |jq -re ".SyncInfo.latest_block_height" )"

docker wait tgrade
# This starts up new tgrade as deamon
docker run --rm -d \
  --name "tgrade" \
  -p "$TENDERMINT_PORT_HOST":"$TENDERMINT_PORT_GUEST" \
  -p "$LCD_API_PORT_HOST":"$LCD_API_PORT_GUEST" \
  --mount type=bind,source="$SCRIPT_DIR/template",target=/template \
  --mount type=volume,source=tgrade_data,target=/root \
  "$REPOSITORY:$NEW_VERSION" \
  /bin/sh -c "tgrade start --trace --home=/root/tgrade 2>&1"

echo "## Wait for chain to start"
echo "--------------------------------------------------------------------------------------------"
until [ "$(docker inspect -f {{.State.Running}} tgrade)"=="true" ]; do
    sleep 0.1;
done;
sleep 3 # add some additinal ramp up time

echo "Current height: $(tgrade status --node="$nodeUrl" |jq -re ".SyncInfo.latest_block_height" )"

echo "--------------------------------------------------------------------------------------------"
echo "## Chain upgrade completed"
echo "--------------------------------------------------------------------------------------------"
echo " "
echo " # Part III: Migrate tfi factory"
echo " "
echo "--------------------------------------------------------------------------------------------"

echo "-----------------------"
echo "## Upload new tfi factory contract"
rsp=$(tgrade tx wasm store "$DIR/contracts/patched_tfi_factory.wasm" \
  --from mykey --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json --home="$home_dir" --keyring-backend=test)
codeID=$(echo "$rsp" | jq -er '.logs[0].events[1].attributes[-1].value')
echo "* Code id: $codeID"

# -----------
# Prepare migration proposal message
title="Migrate tfi factory contract to code id $codeID"
description="Migrate tfi factory contract with address '$factoryContractAddress' to code id '$codeID'"
msg=$(cat << EOF
{"propose": {"title": "$title", "description": "$description", "proposal": {"migrate_contract": {"contract":"$factoryContractAddress", "code_id": $codeID, "migrate_msg": "$(echo -n '{}' | base64)"}} }}
EOF
)
echo "-----------------------"
echo "## Submit tfi factory migration proposal: $msg"
echo "-----------------------"

rsp=$(tgrade tx wasm execute  \
  "$valVotingContractAddr" "$msg" \
  --from mykey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json \
  --home="$home_dir" --keyring-backend=test)
echo $rsp
proposal_id=$(echo "$rsp" | jq -er '.logs[0].events[-1].attributes[3].value')
# No voting required as we have only 1 validator
#
# Prepare migration execute message
msg=$(cat << EOF
{"execute": {"proposal_id": $proposal_id}}
EOF
)

echo "-----------------------"
echo "Execute proposal: $msg"
echo "-----------------------"

rsp=$(tgrade tx wasm execute  \
  "$valVotingContractAddr" "$msg" \
  --from mykey --gas auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl"  -b block -o json \
  --home="$home_dir" --keyring-backend=test)

echo $rsp
echo "--------------------------------------------------------------------------------------------"
echo "## TFI factory migration completed"
echo "--------------------------------------------------------------------------------------------"
rsp=$(tgrade q wasm contract $factoryContractAddress -o json --node="$nodeUrl")
echo "$rsp"
newCodeID=$(echo "$rsp" | jq -re ".contract_info.code_id")
if [ "$newCodeID" != "$codeID" ]; then
   echo "Unexpected code id:  $newCodeID";
   exit 1;
fi
rm -rf ${work_dir}
echo "## Done: containers still up for manual testing"

