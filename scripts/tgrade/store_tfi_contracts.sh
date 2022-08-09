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

contracts="cw20_base trusted_token tfi_factory tfi_pair"

for contract in $contracts
do
  # Store contract
  rsp=$(tgrade tx wasm store "$DIR/contracts/$contract.wasm" \
    --from $key --gas=auto --gas-prices=0.1utgd --gas-adjustment=1.2 -y --chain-id="$chainId" --node="$nodeUrl" -b block -o json "$keyringBackend")
  codeID=$(echo "$rsp" | jq -er '.logs[0].events[1].attributes[-1].value')
  echo "$contract Code Id: $codeID"
done
