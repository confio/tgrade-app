import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { getErrorFromStackTrace } from "utils/errors";
import { ValidatorContract, ValidatorSlashing } from "utils/validator";

import DistributionModal from "../DistributionModal";
import ShowTxResult, { TxResult } from "../ShowTxResult";
import StakeModal, { StakeModalState } from "../StakeModal";
import { ValidatorType } from "../ValidatorOverview";
import {
  ButtonGroup,
  ModalHeader,
  StyledCard,
  StyledInfoRow,
  StyledModal,
  StyledTable,
  Title,
} from "./style";

const columns = [
  {
    title: "Slashed at height",
    dataIndex: "slash_height",
    key: "slash_height",
  },
  {
    title: "Slashed portion",
    dataIndex: "portion",
    key: "portion",
  },
];

interface ModalProps {
  readonly visible: boolean;
  readonly validator?: ValidatorType;
  readonly reloadValidator: () => Promise<void>;
  readonly onCancel: () => void;
  readonly blockchainValues: any;
}

export function ValidatorDetail({
  visible,
  validator,
  blockchainValues,
  reloadValidator,
  onCancel,
}: ModalProps): JSX.Element | null {
  const { handleError } = useError();
  const {
    sdkState: { config, address, signingClient },
  } = useSdk();

  const [txResult, setTxResult] = useState<TxResult>();
  const [stakeModalState, setStakeModalState] = useState<StakeModalState>({ open: false });
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false);
  const [slashingEvents, setSlashingEvents] = useState<readonly ValidatorSlashing[]>([]);
  const [isUnjailing, setUnjailing] = useState(false);

  useEffect(() => {
    (async function getSlashingEvents() {
      if (!validator || !signingClient) return;

      try {
        const validatorContract = new ValidatorContract(config, signingClient);
        const slashingEvents = await validatorContract.getSlashingEvents(validator.operator);
        setSlashingEvents(slashingEvents);
      } catch {
        console.log(`${validator.operator} does not have slashing events`);
      }
    })();
  }, [config, signingClient, validator]);

  if (!validator) return null;

  const todayDateInSeconds = Math.round(new Date().getTime() / 1000);
  // Offset required due to inaccuracy in actual release time. Twelve hours in seconds
  const dateOffset = 12 * 60 * 60;
  const isJailed = !!validator.jailed_until;
  const jailedUntilInMilliseconds = isJailed
    ? Math.round(
        (todayDateInSeconds +
          parseInt((validator.jailed_until as { Until: string }).Until, 10) +
          dateOffset) /
          1000000,
      )
    : 0;
  const jailedUntilDate = isJailed
    ? validator.jailed_until === "forever"
      ? "Jailed forever"
      : `Jailed until ${new Date(jailedUntilInMilliseconds).toLocaleDateString()}`
    : undefined;

  // TODO: properly detect when can unjail. Once we have several validators in a local network.
  /* const canUnjailSelf =
    // Current user is the validator
    address === validator.operator &&
    // Validator is jailed but expiration date has been reached
    isJailed &&
    validator.jailed_until !== "forever" &&
    new Date(jailedUntilInMilliseconds) < new Date(); */
  const canUnjailSelf = address === validator.operator;

  async function submitUnjailSelf() {
    if (!signingClient || !address) return;

    setUnjailing(true);
    try {
      const validatorContract = new ValidatorContract(config, signingClient);
      const transactionHash = await validatorContract.unjailSelf(address);
      setTxResult({ msg: `Unjailed self successful. Transaction ID: ${transactionHash}` });
      await reloadValidator();
    } catch (error) {
      if (!(error instanceof Error)) return;
      setTxResult({ error: getErrorFromStackTrace(error) });
      handleError(error);
    } finally {
      setUnjailing(false);
    }
  }

  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={visible}
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
        backgroundColor: txResult ? "transparent" : "var(--bg-body)",
      }}
      maskStyle={{ background: txResult ? "rgba(4,119,120,0.9)" : "rgba(4,119,120,0.6)" }}
    >
      {txResult ? (
        <ShowTxResult {...txResult}>
          <Button onClick={() => setTxResult(undefined)}>
            <span>Go to Validator details</span>
          </Button>
        </ShowTxResult>
      ) : (
        <>
          <ModalHeader>
            <Stack gap="s1"></Stack>

            <img alt="Close button" src={closeIcon} onClick={onCancel} />
          </ModalHeader>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "530px" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Title> {validator.metadata?.moniker ?? ""}</Title>
                <p> {validator.operator}</p>
                <p> {validator.metadata?.website ?? ""}</p>
              </div>
              {validator.jailed_until ? (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--s0)" }}>
                  <p style={{ color: "red" }}>{jailedUntilDate || "not jailed"}</p>
                  {canUnjailSelf ? (
                    <Button onClick={submitUnjailSelf} loading={isUnjailing}>
                      Try unjail
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                marginTop: "15px",
                width: "100%",
                height: "125px",
              }}
            >
              <StyledCard>
                <Title>Engagement points</Title>
                <StyledInfoRow>
                  <b>{validator.engagementPoints} /</b> <p> {blockchainValues.totalEgPoints}</p>
                </StyledInfoRow>
              </StyledCard>
              <StyledCard>
                <Title>Engagement rewards, TGD</Title>
                <StyledInfoRow>
                  <b>{validator.rewards} /</b> <p> {blockchainValues.totalEgRewards}</p>
                </StyledInfoRow>
                <Button type="ghost" onClick={() => setDistributionModalOpen(true)}>
                  Claimed Engagement
                </Button>
              </StyledCard>
              <StyledCard>
                <Title>Staked, TGD</Title>
                <StyledInfoRow>
                  <b>{validator.staked || "-"} /</b> <p> {blockchainValues.totalTGD}</p>
                </StyledInfoRow>
                {validator.operator === address ? (
                  <ButtonGroup>
                    <Button
                      type="ghost"
                      onClick={() => setStakeModalState({ open: true, operation: "unstake" })}
                    >
                      Unstake
                    </Button>
                    <Button onClick={() => setStakeModalState({ open: true, operation: "stake" })}>
                      Stake
                    </Button>
                  </ButtonGroup>
                ) : null}
              </StyledCard>
              <StyledCard>
                <Title>Potential voting power</Title>
                <p>{validator.power}</p>
              </StyledCard>
            </div>
            <div style={{ marginTop: "25px", marginBottom: "10px" }}>
              <Title>Slashing events</Title>
            </div>
            <StyledTable
              pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
              dataSource={slashingEvents}
              columns={columns}
            />
          </div>
          <StakeModal
            modalState={stakeModalState}
            setModalState={setStakeModalState}
            reloadValidator={reloadValidator}
          />
          <DistributionModal
            isModalOpen={isDistributionModalOpen}
            setModalOpen={setDistributionModalOpen}
            reloadValidator={reloadValidator}
          />
        </>
      )}
    </StyledModal>
  );
}
