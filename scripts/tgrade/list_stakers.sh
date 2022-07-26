#!/usr/bin/env bash
set -o errexit -o nounset -o pipefail
#set -x

source ./env.sh

stakeAddr=$(tgrade q poe contract-address STAKING -o json --node="$nodeUrl" | jq -re ".address")
start_after=null
echo "validator,liquid_stake,vesting_stake,account_type,total_balance,delegated_free,delegated_vesting"
while [ -n "$start_after" ]
do
  members=$(tgrade query wasm contract-state smart $stakeAddr "{ \"list_members\": { \"limit\": 30, \"start_after\": $start_after } }" -o json --node="$nodeUrl" | jq .data.members[].addr)
  if [ -n "$members" ]
  then
    for member in $members
    do
      addr=$(echo $member | jq -r .)
      staked=$(tgrade query wasm contract-state smart $stakeAddr "{\"staked\": { \"address\": $member } }" -o json --node="$nodeUrl" | jq .data)
      balances=$(tgrade query bank balances $addr --node=$nodeUrl -o json | jq -r '.balances[].amount')
      liquid=$(echo $staked | jq -r .liquid.amount)
      vesting=$(echo $staked | jq -r .vesting.amount)
      account=$(tgrade query account $addr --node=$nodeUrl -o json)
      account_type=$(echo $account | jq -r '.["@type"]' | sed 's/.*\.//')
      delegated_free=0
      delegated_vesting=0
      if [ "$account_type" = "ContinuousVestingAccount" ]
      then
        delegated_free=$(echo $account | jq -r '.base_vesting_account.delegated_free[].amount')
        delegated_vesting=$(echo $account | jq -r '.base_vesting_account.delegated_vesting[].amount')
      fi
      echo $addr,$liquid,$vesting,$account_type,$balances,$delegated_free,$delegated_vesting
    done
    start_after=$(echo $members | jq . 2>/dev/null | tail -1)
  else
    start_after=''
  fi
done
