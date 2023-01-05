#!/usr/bin/env bash
set -o errexit -o pipefail

function print_usage() {
  echo "Usage: $0 [-h|--help] [-i|--instances] [-m|--max <max_code_id>]
-h|--help: This cruft.
-i|--instances: List only contract instances.
-m|--max <code_id>: List only up to <code_id>.
Bail as soon as the first one fails, or max_code_id is reached."
}

function remove_opt() {
    ORIGINAL_OPTS=$(echo "$ORIGINAL_OPTS" | sed "s/\\B$1\\b//")
}

while [ -n "$1" ]
do
case $1 in
  -h|--help)
    print_usage
    exit 1
    ;;
  -i|--instances)
    O="$1"
    shift
    ;;
  -m|--max)
    shift
    MAX="$1"
    shift
    ;;
  *)
    print_usage
    exit 1
    ;;
esac
done

C=1
while true
do
  ADDRS=$(tgrade query wasm list-contract-by-code "$C" -o json --node="$nodeUrl" | jq -r '.contracts[]')
  if [ -n "$ADDRS" ]
  then
    echo $C:
    for ADDR in $ADDRS
    do
      tgrade q wasm contract $ADDR -o json --node="$nodeUrl" 2>/dev/null| jq -re '.'
    done
  elif [ "$O" = "-i" ] || [ "$O" = "--instances" ]
  then
    echo $C:
    # Download wasm and skip it (just to errexit)
    tgrade q wasm code "$C" /dev/null --node=$nodeUrl >/dev/null 2>&1 || exit 0
  else
    # Download wasm and get contract name and version from it
    ./get_contract_version.sh $C || exit 0
  fi
  if [ -n "$MAX" ] && [ $C -ge $MAX ]
  then
    exit 0
  fi
  C=$[C + 1]
done
