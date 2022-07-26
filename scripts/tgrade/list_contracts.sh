#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail

C=1
while true
do
  echo $C:
  A=$(tgrade query wasm list-contract-by-code "$C" -o json --node="$nodeUrl" | jq -r '.contracts[0]')
  if [ "$A" != "null" ]
  then
    tgrade q wasm contract $A -o json --node="$nodeUrl" 2>/dev/null| jq -re '.'
  else
    # Download wasm and get contract name and version from it
    tgrade q wasm code "$C" "./contracts/$C.wasm" --node=$nodeUrl 2>/dev/null
    strings "./contracts/$C.wasm" | sed -E -n '/(^|[^ ])crates.io:/s/.*crates.io:([a-zA-Z0-9._-].*)([0-9]\.[0-9][0-9]*\.[0-9][0-9]*).*/\1-\2/p'
  fi
  C=$[C + 1]
done
