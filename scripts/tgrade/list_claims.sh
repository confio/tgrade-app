#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
#set -x

#source ./env.sh

stakeAddr=$(tgrade q poe contract-address STAKING -o json --node="$nodeUrl" | jq -re ".address")
start_after=null
while [ -n "$start_after" ]
do
  members=$(tgrade query wasm contract-state smart $stakeAddr "{ \"list_members\": { \"limit\": 30, \"start_after\": $start_after } }" -o json --node="$nodeUrl" | jq .data.members[].addr)
  if [ -n "$members" ]
  then
    for member in $members
    do
      echo $member:
      tgrade query wasm contract-state smart $stakeAddr "{ \"claims\": { \"address\": $member } }" -o json --node="$nodeUrl" | jq '.'
    done
    start_after=$(echo $members | jq . 2>/dev/null | tail -1)
  else
    start_after=''
  fi
done
