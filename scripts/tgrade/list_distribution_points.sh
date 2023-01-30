#!/usr/bin/env bash
#set -o errexit -o nounset -o pipefail
set -o errexit -o pipefail
#set -x

H="$1"
[ "$H" = "-h" ] || [ "$H" = "--help" ] && echo "Usage: $0 [height]" && echo "Specifying height requires archiving node." && exit 1
if [ -n "$H" ]
then
  [ -z "$archUrl" ] && echo "archUrl env var not set!" && exit 1
  nodeUrl="$archUrl"
  H="--height=$H"
fi

#source ./env.sh

distrAddr=$(tgrade q poe contract-address DISTRIBUTION -o json --node="$nodeUrl" | jq -re ".address")
start_after=null
echo "member,points"
while [ -n "$start_after" ]
do
  members=$(tgrade query wasm contract-state smart $distrAddr "{ \"list_members_by_points\": { \"limit\": 30, \"start_after\": $start_after } }" $H -o json --node="$nodeUrl" | jq .data.members)
  addrs=$(echo $members | jq -r .[].addr)
  points=$(echo $members | jq .[].points)
  if [ -n "$addrs" ]
  then
    i=1
    for addr in $addrs
    do
      point=$(echo $points | cut -d\  -f$i)
      echo $addr,$point
      i=$((i + 1))
    done
    start_after="$(echo $members | jq .[-1] 2>/dev/null)" 
  else
    start_after=''
  fi
done
