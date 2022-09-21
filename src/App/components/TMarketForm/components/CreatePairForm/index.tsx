import { Typography } from "antd";
import Button from "App/components/Button";
import { TxResult } from "App/components/ShowTxResult";
import { useCallback, useState } from "react";
import { useError, useSdk } from "service";
import { useTokens } from "service/tokens";
import { getErrorFromStackTrace } from "utils/errors";
import { Factory } from "utils/factory";

const { Text } = Typography;

interface CreatePairFormProps {
  readonly setTxResult: React.Dispatch<React.SetStateAction<TxResult | undefined>>;
  readonly loadPair: () => Promise<void>;
}

export function CreatePairForm({ setTxResult, loadPair }: CreatePairFormProps): JSX.Element {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();
  const {
    tokensState: { selectedTokenFrom, selectedTokenTo },
  } = useTokens();

  const [isSubmitting, setSubmitting] = useState(false);

  const submitCreatePair = useCallback(async () => {
    if (!signingClient || !address || !selectedTokenFrom || !selectedTokenTo || !loadPair) return;

    setSubmitting(true);
    try {
      const txHash = await Factory.newCreatePair(
        signingClient,
        address,
        config.factoryAddress,
        [selectedTokenFrom, selectedTokenTo],
        config,
      );
      setTxResult({ msg: `Successfully created pair. Transaction ID: ${txHash}` });
      await loadPair();
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
      setSubmitting(false);
    }
  }, [
    address,
    config,
    handleError,
    loadPair,
    selectedTokenFrom,
    selectedTokenTo,
    setTxResult,
    signingClient,
  ]);

  return (
    <div>
      <Text>The pair needs to be created before operating with it.</Text>
      <Button onClick={submitCreatePair} loading={isSubmitting}>
        Create pair
      </Button>
    </div>
  );
}
