import { Typography } from "antd";
import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import ShowTxResult, { TxResult } from "App/components/ShowTxResult";
import { PoEContractType } from "codec/confio/poe/v1beta1/poe";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { EngagementContract, EngagementContractQuerier } from "utils/poeEngagement";

import Stack from "../Stack/style";
import DelegateContainer from "./components/DelegateContainer";
import WithdrawRewardsContainer from "./components/WithdrawRewardsContainer";
import { ModalHeader, StyledModal, TextStack } from "./style";

const { Title, Text } = Typography;

interface DistributionModalProps {
  readonly isModalOpen: boolean;
  readonly setModalOpen: (open: boolean) => void;
  readonly reloadValidator: () => Promise<void>;
}

export default function DistributionModal({
  isModalOpen,
  setModalOpen,
  reloadValidator,
}: DistributionModalProps): JSX.Element {
  const {
    sdkState: { config, client, signingClient },
  } = useSdk();
  const [txResult, setTxResult] = useState<TxResult>();

  function resetModal() {
    setModalOpen(false);
    setTxResult(undefined);
  }

  const [egContract, setEgContract] = useState<EngagementContractQuerier>();

  useEffect(() => {
    if (signingClient) {
      setEgContract(new EngagementContract(config, PoEContractType.DISTRIBUTION, signingClient));
      return;
    }

    if (client) {
      setEgContract(new EngagementContractQuerier(config, PoEContractType.DISTRIBUTION, client));
    }
  }, [client, config, signingClient]);

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={isModalOpen}
      destroyOnClose
      width="100%"
      bgTransparent={!!txResult}
      style={{
        right: "-40px",
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        borderRadius: "16px",
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{ background: "rgba(26, 29, 38,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          {txResult.error ? (
            <Button onClick={() => setTxResult(undefined)}>
              <span>Try again</span>
            </Button>
          ) : null}
          <Button onClick={() => resetModal()}>
            <span>Go to Validator details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <>
          <ModalHeader>
            <img alt="Close button" src={closeIcon} onClick={() => resetModal()} />
          </ModalHeader>
          <Stack gap="s4">
            <TextStack>
              <Title>Distributed rewards</Title>
              <Text>You can delegate the withdrawal of your funds to another address.</Text>
              <Text>
                You may also check any address' distributed points and rewards, and attempt a reward
                withdrawal. Another address can be set as receiver of the withdrawal.
              </Text>
            </TextStack>
            <DelegateContainer
              egContract={egContract}
              setTxResult={setTxResult}
              reloadValidator={reloadValidator}
            />
            <WithdrawRewardsContainer
              egContract={egContract}
              setTxResult={setTxResult}
              reloadValidator={reloadValidator}
            />
          </Stack>
        </>
      )}
    </StyledModal>
  );
}
