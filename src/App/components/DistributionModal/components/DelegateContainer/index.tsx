import { Typography } from "antd";
import { TxResult } from "App/components/ShowTxResult";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { getFormItemName, isValidAddress } from "utils/forms";
import { EngagementContract, EngagementContractQuerier } from "utils/poeEngagement";
import * as Yup from "yup";

import DelegateForm, { defendantAddressLabel, FormDelegateValues } from "./DelegateForm";

const { Text } = Typography;

interface DelegateContainerProps {
  readonly egContract: EngagementContractQuerier | undefined;
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly reloadValidator: () => Promise<void>;
}

export default function DelegateContainer({
  egContract,
  setTxResult,
  reloadValidator,
}: DelegateContainerProps): JSX.Element | null {
  const {
    sdkState: { config, address },
  } = useSdk();

  const [delegatedAddress, setDelegatedAddress] = useState("");

  useEffect(() => {
    (async function updateDelegatedAddress() {
      if (!egContract || !address) return;

      const delegatedAddress = await egContract.getDelegated(address);
      setDelegatedAddress(delegatedAddress);
    })();
  }, [address, egContract]);

  const delegateValidationSchema = Yup.object().shape({
    [getFormItemName(defendantAddressLabel)]: Yup.string()
      .typeError("Delegated address must be alphanumeric")
      .required("Delegated address is required")
      .test(
        "is-address-valid",
        "Delegated address must be valid",
        (delegatedAddress) => !delegatedAddress || isValidAddress(delegatedAddress, config.addressPrefix),
      ),
  });

  async function submitDelegate({ delegatedAddress }: FormDelegateValues) {
    if (!address || !(egContract instanceof EngagementContract)) return;

    try {
      const txHash = await egContract.delegateWithdrawal(address, delegatedAddress);
      setTxResult({ msg: `Set ${delegatedAddress} as delegated address. Transaction ID: ${txHash}` });
      await reloadValidator();
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
    }
  }

  return address ? (
    <DelegateForm
      address={address}
      delegatedAddress={delegatedAddress}
      delegateValidationSchema={delegateValidationSchema}
      submitDelegate={submitDelegate}
    />
  ) : (
    <Text style={{ textAlign: "left" }}>
      You need an address in order to delegate the withdrawal of your funds
    </Text>
  );
}
