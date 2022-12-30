#!/bin/bash
# Requires GNU date (coreutils package) instead of silly Mac's date

NS="$1"
[ -z "$NS" ] && echo "Usage: $0 <nano seconds since epoch>" && exit 1

S=$(echo "$NS" | sed -E 's/([0-9]{9})$/.\1/')

TZ="UTC" date '+%Y-%m-%d %H:%M:%S %Z' --date "1970-01-01 UTC + $S seconds"
