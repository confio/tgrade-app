#!/usr/bin/env bash
set -o errexit -o pipefail

O="$1"
if [ "$O" = "-h" ] || [ "$O" = "--help" ] || { [ "$O" != "" ] && [ "$O" != "-i" ] && [ "$O" != "--instances" ] ; }
then
  echo "Usage: $0 [-h|--help] [-i|--instances]"
  echo "-h|--help: This cruft."
  echo "-i|--instances: List only contract instances."
  echo "Bail as soon as the first one fails."
  exit 1
fi

C=1
while true
do
  A=$(tgrade query wasm list-contract-by-code "$C" -o json --node="$nodeUrl" | jq -r '.contracts[0]')
  if [ "$A" != "null" ]
  then
    echo $C:
    tgrade q wasm contract $A -o json --node="$nodeUrl" 2>/dev/null| jq -re '.'
  elif [ "$O" = "-i" ] || [ "$O" = "--instances" ]
  then
    echo $C:
    # Download wasm and skip it (just to errexit)
    tgrade q wasm code "$C" /dev/null --node=$nodeUrl >/dev/null 2>&1
  else
    # Download wasm and get contract name and version from it
    ./get_contract_version.sh $C
  fi
  C=$[C + 1]
done