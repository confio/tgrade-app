#!/bin/bash
# Searches for a block height just after the given date
# Requires GNU date (coreutils package) instead of silly Mac's date

D="$1"
[ -z "$D" ] && echo "Usage: $0 <date>" && exit 1

TS=$(date '+%s' --date "$D")
echo "Searching for: $D ($TS)"

# First block
FIRST_HEIGHT=1
FIRST_TIME=$(curl -s $nodeUrl/block?height=$FIRST_HEIGHT | jq -r .result.block.header.time)
FIRST_TS=$(date '+%s' --date "$FIRST_TIME")

# Current block
CURRENT_HEIGHT=$(curl -s $nodeUrl/block | jq -r .result.block.header.height)
# Current time
CURRENT_TIME=$(curl -s $nodeUrl/block?height=$CURRENT_HEIGHT | jq -r .result.block.header.time)
CURRENT_TS=$(date '+%s' --date "$CURRENT_TIME")

echo "First time: $FIRST_TIME ($FIRST_TS): $FIRST_HEIGHT"
echo "Current time: $CURRENT_TIME ($CURRENT_TS): $CURRENT_HEIGHT"

# Binary search
while [ $[CURRENT_HEIGHT - $FIRST_HEIGHT] -gt 1 ]; do
    # Middle block
    MIDDLE_HEIGHT=$((($FIRST_HEIGHT + $CURRENT_HEIGHT) / 2))
    MIDDLE_TIME=$(curl -s $nodeUrl/block?height=$MIDDLE_HEIGHT | jq -r .result.block.header.time)
    MIDDLE_TS=$(date '+%s' --date "$MIDDLE_TIME")

    echo "Middle time: $MIDDLE_TIME ($MIDDLE_TS): $MIDDLE_HEIGHT"

    if [ $MIDDLE_TS -lt $TS ]; then
        FIRST_HEIGHT=$MIDDLE_HEIGHT
        FIRST_TIME=$MIDDLE_TIME
        FIRST_TS=$MIDDLE_TS
    else
        CURRENT_HEIGHT=$MIDDLE_HEIGHT
        CURRENT_TIME=$MIDDLE_TIME
        CURRENT_TS=$MIDDLE_TS
    fi
done
