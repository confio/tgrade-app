#!/usr/bin/env bash
#set -o errexit -o nounset -o pipefail
set -o errexit -o pipefail
command -v shellcheck >/dev/null && shellcheck -x "$0"
#set -x

#source ./env.sh
H="$1"
[ "$H" = "-h" ] || [ "$H" = "--help" ] && echo "Usage: $0 [height]" && echo "Specifying height requires archiving node." && exit 1
if [ -n "$H" ]
then
  [ -z "$archUrl" ] && echo "archUrl env var not set!" && exit 1
  avgBlockTime=5.926 # [seconds]
  completionTime=$((21 * 24 * 60 * 60)) # [seconds]
  blocks=$(echo "scale=0;$completionTime / $avgBlockTime + 1" | bc -l)
  nodeUrl="$archUrl"
  memberH=$((H - blocks))
  [ $memberH -lt 1 ] && memberH=1
  H="--height=$H"
  memberH="--height=$memberH"
fi

stakeAddr=$(tgrade q poe contract-address STAKING -o json --node="$nodeUrl" | jq -re ".address")
start_after=null
while [ -n "$start_after" ]
do
  # shellcheck disable=SC2116,SC2086
  members=$(tgrade query wasm contract-state smart "$stakeAddr" "{ \"list_members\": { \"limit\": 30, \"start_after\": $start_after } }" -o json --node="$nodeUrl" $memberH | jq .data.members[].addr)
  if [ -n "$members" ]
  then
    for member in $members
    do
      echo "$member:"
      # shellcheck disable=SC2116,SC2086
      tgrade query wasm contract-state smart "$stakeAddr" "{ \"claims\": { \"address\": $member } }" -o json --node="$nodeUrl" $H | jq '.'
    done
    start_after=$(echo "$members" | jq . 2>/dev/null | tail -1)
  else
    start_after=''
  fi
done
