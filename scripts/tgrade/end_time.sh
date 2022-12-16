#!/bin/bash
# Requires GNU date (coreutils package) instead of silly Mac's date

S="$1"
[ -z "$S" ] && echo "Usage: $0 <seconds since epoch>" && exit 1

date --date "1970-01-01 UTC + $S seconds"
