#!/usr/bin/env bash
set -o errexit -o pipefail

O="$1"
if [ "$O" = "-h" ] || [ "$O" = "--help" ] || [ "$O" == "" ]
then
  echo "Usage: $0 [-h|--help] <code-id>|<contract>.wasm"
  echo "-h|--help: This cruft."
  exit 1
fi
C=$1

echo $C:
if echo $C | grep -q -v '\.wasm$'
then
  # Download wasm and get contract name and version from it
  tgrade q wasm code "$C" "./contracts/$C.wasm" --node=$nodeUrl 2>/dev/null
  C="./contracts/$C.wasm"
fi
strings "$C" | sed -E -n '/(^|[^ ])crates.io:/s/.*crates.io:([a-zA-Z0-9._-]*)([0-9]\.[0-9][0-9]*\.[0-9][0-9]*).*/\1-\2/p'
if echo $C | grep -q -v '\.wasm$'
then
  rm -f "./contracts/$C.wasm"
fi
