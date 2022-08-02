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
#otherKey1="validator2-$chainSuffix"
#otherKey2="validator3-$chainSuffix"

cw20Name="cw20-base"
cw20CodeId=10 # From ./list_contract.sh
cw20Contract="cw20_base.wasm"

factoryName="tfi-factory"
factoryCodeId=12 # From ./list_contract.sh

keyAddr=$(tgrade keys show "$key" "$keyringBackend" | grep address: | cut -f4 -d\ )

echo "## Upload new $cw20Name contract"
rsp=$(tgrade tx wasm store "$DIR/contracts/$cw20Contract" \
  --from "$key" --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" "$keyringBackend" -b block -o json)
codeId=$(echo "$rsp" | jq -r '.logs[0].events[1].attributes[-1].value')
echo "* Code id: $codeId"

# Migrate existing cw20-base *instances* to new code id
echo "## Migrating  $cw20Name instances from code id '$cw20CodeId' to new code id '$codeId'"

# 1. Get addresses to migrate
cw20Addrs=$(tgrade query wasm list-contract-by-code "$cw20CodeId" -o json --node="$nodeUrl" | jq -r '.contracts[]')

for cw20Addr in $cw20Addrs
do
  echo "Migrating $cw20Addr:"
  # Get contract info
  cw20ContractInfo=$(tgrade q wasm contract "$cw20Addr" -o json --node="$nodeUrl" | jq '.contract_info')
  echo "Contract info: "
  echo "$cw20ContractInfo" | jq '.'
  # Get migrate admin
  cw20MigrateAdmin=$(echo "$cw20ContractInfo" | jq -r '.admin')
  [ -z "$cw20MigrateAdmin" ] && echo "No migrate admin!" && exit 1
  echo "Migrate admin: $cw20MigrateAdmin"
  # Get migrate admin key
  cw20MigrateAdminKey=$(tgrade keys list "$keyringBackend" | grep -B2 "$cw20MigrateAdmin" | head -1 | cut -f3 -d\ )
  [ -z "$cw20MigrateAdminKey" ] && echo "Need to import / recover the credentials for '$cw20MigrateAdminKey'" && exit 1
  echo "Migrate admin key: $cw20MigrateAdminKey"

  # Migrate
  tgrade tx wasm migrate "$cw20Addr" "$codeId" "{ }" --from "$cw20MigrateAdminKey" --gas auto --gas-prices=0.1utgd --gas-adjustment=1.3 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend"
done

# Update tfi-factory config
echo "## Update $factoryName contract config"
# 1. Get tfi-factory address
tfiAddr=$(tgrade query wasm list-contract-by-code "$factoryCodeId" -o json --node="$nodeUrl" | jq -r '.contracts[0]')

# 2. Query tfi-factory config
tfiConfig=$(tgrade query wasm contract-state smart "$tfiAddr" "{ \"config\": { } }" -o json --node="$nodeUrl" | jq '.data')
echo "$factoryName config:"
echo "$tfiConfig" | jq '.'

# 3. Get tfi-factory owner
tfiOwner=$(echo "$tfiConfig" | jq -r '.owner')
echo "$factoryName owner address: $tfiOwner"

# 4. Confirm we have the credentials for that owner, and get their key
tfiOwnerKey=$(tgrade keys list "$keyringBackend" | grep -B2 "$tfiOwner" | head -1 | cut -f3 -d\ )
[ -z "$tfiOwnerKey" ] && echo "Need to import / recover the credentials for '$tfiOwner'" && exit 1

echo "$factoryName owner key: $tfiOwnerKey"

# 5. Update tfi-factory config
echo "## Now update $factoryName contract config using '$tfiOwnerKey' as key"
tgrade tx wasm execute "$tfiAddr" "{ \"update_config\": { \"token_code_id\": $codeId } }" --from "$tfiOwnerKey" --gas auto --gas-prices=0.1utgd --gas-adjustment=1.3 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend" | jq .

echo "--------------------------------------------------------------------------------------------"
echo "## cw20-base store and tfi-factory migrate config completed"
echo "--------------------------------------------------------------------------------------------"

# Verifications
# Verify tfdi config is set with new code id
tfiConfig=$(tgrade query wasm contract-state smart "$tfiAddr" "{ \"config\": { } }" -o json --node="$nodeUrl" | jq '.data')
echo "$tfiConfig" | jq .

newCodeID=$(echo "$tfiConfig" | jq -r '.token_code_id')
if [ "$newCodeID" != "$codeId" ]
then
  echo "Unexpected code id: $newCodeID"
  exit 1
fi

# Verify *allowances per spender* can now be queried
for cw20Addr in $cw20Addrs
do
  tgrade query wasm contract-state smart "$cw20Addr" "{\"all_spender_allowances\": { \"spender\": \"$keyAddr\" } }" -o json --node="$nodeUrl" | jq '.data'
done
