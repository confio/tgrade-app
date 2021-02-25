import { coins, StdFee } from "@cosmjs/launchpad";
import { Decimal } from "@cosmjs/math";

// TODO: better import
import { Validator } from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/staking";
import { NetworkConfig } from "config/network";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";

export { MsgWithdrawDelegatorReward } from "../codec/cosmos/distribution/v1beta1/tx";
export { MsgDelegate, MsgUndelegate } from "../codec/cosmos/staking/v1beta1/tx";

export type StakingValidator = Validator;

export function useStakingValidator(validatorAddress: string): StakingValidator | undefined {
  const { handleError } = useError();
  const { getQueryClient } = useSdk();
  const [validator, setValidator] = useState<StakingValidator>();

  useEffect(() => {
    let mounted = true;

    (async function updateValidator() {
      try {
        const { validator } = await getQueryClient().staking.unverified.validator(validatorAddress);
        if (!validator) {
          throw new Error(`No validator found with address: ${validatorAddress}`);
        }
        if (mounted) setValidator(validator);
      } catch (error) {
        handleError(error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getQueryClient, handleError, validatorAddress]);

  return validator;
}

export function getDelegationFee({ gasPrice, feeToken }: NetworkConfig): StdFee {
  const gas = 200_000;
  return { amount: coins(gasPrice * gas, feeToken), gas: gas.toString() };
}

export function formatShares(shares: string): string {
  return Decimal.fromUserInput(shares, 18).toString();
}

export function formatUpdateTime(updateTime: string): string {
  return new Date(updateTime).toLocaleString(undefined, {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
}
