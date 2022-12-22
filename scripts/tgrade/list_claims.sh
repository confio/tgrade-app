#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
#set -x

#source ./env.sh
H="$1"
[ "$H" = "-h" ] || [ "$H" = "--help" ] && echo "Usage: $0 [height]" && echo "Specifying height requires archiving node." && exit 1
if [ -n "$H" ]
then
  [ -z "$archUrl" ] && echo "archUrl env var not set!" && exit 1
  nodeUrl="$archUrl"
  H="--height=$H"
fi

stakeAddr=$(tgrade q poe contract-address STAKING -o json --node="$nodeUrl" | jq -re ".address")
start_after=null
while [ -n "$start_after" ]
do
  members=$(tgrade query wasm contract-state smart $stakeAddr "{ \"list_members\": { \"limit\": 30, \"start_after\": $start_after } }" -o json --node="$nodeUrl" "$H" | jq .data.members[].addr)
  if [ -n "$members" ]
  then
    for member in $members
    do
      echo $member:
      tgrade query wasm contract-state smart $stakeAddr "{ \"claims\": { \"address\": $member } }" -o json --node="$nodeUrl" "$H" | jq '.'
    done
    start_after=$(echo $members | jq . 2>/dev/null | tail -1)
  else
    start_after=''
  fi
done
