#!/usr/bin/env bash
# Searches for all the historical claims since a given date.
# Requires an archiving node, set in the archUrl env var.
# Requires GNU date (coreutils package) instead of silly Mac's date
#set -o errexit -o nounset -o pipefail
set -o errexit -o pipefail
command -v shellcheck >/dev/null && shellcheck -x "$0"

#set -x

D="$1"
[ "$D" = "-h" ] || [ "$D" = "--help" ] || [ -z "$D" ] && echo "Usage: $0 <date (UTC>" && exit 1
[ -z "$archUrl" ] && echo "archUrl env var not set!" && exit 1

BASE=$(basename "$0" .sh)

# Get completion time interval
# Assumes unbonding period is the same throughout the entire period
stakingAddr=$(tgrade q poe contract-address "STAKING" -o json --node="${nodeUrl:?}" | jq -re '.address')
INTERVAL=$(tgrade query wasm contract-state smart "$stakingAddr" '{ "configuration": {} }' -o json --node="$nodeUrl" | jq -r '.data.unbonding_period')

# Compute ts for comparison
TS=$(date '+%s' --date "$D")
CURRENT_TS=$(date '+%s')

LOG="$BASE-${chainId:?}".txt
rm -f "$LOG"
while [ "$TS" -lt "$CURRENT_TS" ]
do
  echo "Searching for $D..."
  HEIGHT_LINE=$(./height_search.sh "$D" | tail -1)
  echo "done."
  echo "Found $HEIGHT_LINE" | tee -a "$LOG"
  HEIGHT=$(echo "$HEIGHT_LINE" | cut -f5 -d\ )
  # Round height to lowest hundred
  # shellcheck disable=SC2001
  HEIGHT=$(echo "$HEIGHT" | sed 's/[0-9][0-9]$/00/')

  TIME=$(curl -s "$nodeUrl/block?height=$HEIGHT" | jq -r '.result.block.header.time')
  echo "Equivalent time: $TIME"

  # List claims at that height
  echo "Listing claims at $HEIGHT..."
  ./list_claims.sh "$HEIGHT" | tee "claims-${chainId:?}-$(printf '%08d' "$HEIGHT")".txt
  echo "done."

  # Compute next date (with a safety margin)
  D=$(date --date "$D + $INTERVAL seconds - 1 day")
  # Compute ts
  TS=$(date '+%s' --date "$D")
done
