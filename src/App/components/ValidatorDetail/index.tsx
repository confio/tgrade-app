import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import Stack from "App/components/Stack/style";
import { useEffect, useState } from "react";
import { useError, useSdk } from "service";
import { nativeCoinToDisplay } from "utils/currency";
import { getErrorFromStackTrace } from "utils/errors";
import { Claim, StakingContractQuerier } from "utils/staking";
import { ValidatorContract, ValidatorContractQuerier, ValidatorSlashing } from "utils/validator";

import AddressTag from "../AddressTag";
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

const claimsColumns = [
  {
    title: "Created at height",
    dataIndex: "creation_height",
    key: "creation_height",
    width: "20%",
  },
  {
    title: "Liquid amount",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Vesting amount",
    dataIndex: "vesting_amount",
    key: "vesting_amount",
  },
  {
    title: "Expiration",
    key: "release_at",
    width: "10%",
    render: (record: Claim) => {
      const expiryTime = record.release_at / 1000000;
      const formatedDate = new Date(expiryTime).toLocaleDateString();
      const formatedTime = new Date(expiryTime).toLocaleTimeString();
      return (
        <>
          <div>{formatedDate}</div>
          <div>{formatedTime}</div>
        </>
      );
    },
  },
];

const slashingEventsColumns = [
  {
    title: "Slashed at height",
    dataIndex: "slash_height",
    key: "slash_height",
    width: "20%",
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
    sdkState: { config, client, address, signingClient },
  } = useSdk();

  const [txResult, setTxResult] = useState<TxResult>();
  const [stakeModalState, setStakeModalState] = useState<StakeModalState>({ open: false });
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false);
  const [claims, setClaims] = useState<readonly Claim[]>([]);
  const [slashingEvents, setSlashingEvents] = useState<readonly ValidatorSlashing[]>([]);
  const [isUnjailing, setUnjailing] = useState(false);

  useEffect(() => {
    (async function getClaims() {
      if (!validator || !client) return;

      try {
        const stakingContract = new StakingContractQuerier(config, client);
        const claims = await stakingContract.getAllClaims(validator.operator);

        const sortedClaims = claims.slice().sort((a, b) => b.release_at - a.release_at);

        const humanClaims = sortedClaims.map((claim) => {
          const displayAmount = nativeCoinToDisplay(
            { denom: config.feeToken, amount: claim.amount },
            config.coinMap,
          ).amount;
          const displayVestingAmount = nativeCoinToDisplay(
            { denom: config.feeToken, amount: claim.vesting_amount ?? "0" },
            config.coinMap,
          ).amount;

          return { ...claim, amount: displayAmount, vesting_amount: displayVestingAmount };
        });

        setClaims(humanClaims);
      } catch {
        // NOTE: the validator does not have claims, do nothing
      }
    })();
  }, [client, config, validator]);

  useEffect(() => {
    (async function getSlashingEvents() {
      if (!validator || !client) return;

      try {
        const validatorContract = new ValidatorContractQuerier(config, client);
        const slashingEvents = await validatorContract.getSlashingEvents(validator.operator);
        setSlashingEvents(slashingEvents);
      } catch {
        // NOTE: the validator does not have slashing events, do nothing
      }
    })();
  }, [client, config, validator]);

  if (!validator) return null;

  const isJailedWithExpiry = !!validator.jailed_until?.end?.until;
  const isJailedForever = validator.jailed_until?.end?.forever ? true : false;
  const jailedUntilInMilliseconds = validator.jailed_until?.end?.until
    ? Number(validator.jailed_until?.end?.until) / 1000000
    : 0;
  const jailedUntilDate = new Date(jailedUntilInMilliseconds);

  const canUnjailSelf = address === validator.operator && isJailedWithExpiry && jailedUntilDate < new Date();

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

  const votingPowerOrZero = !validator.power || validator.power === 0 ? 0 : validator.power;
  const fixedVotingPower = votingPowerOrZero.toFixed(3);
  const isSmallVotingPower = fixedVotingPower === "0.000" && votingPowerOrZero !== 0;
  const votingPower = isSmallVotingPower ? "~ 0.001" : fixedVotingPower;

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
        backgroundColor: "var(--bg-body)",
      }}
      maskStyle={{ background: "rgba(26, 29, 38,0.6)" }}
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

            <img
              alt="Close button"
              src={closeIcon}
              onClick={onCancel}
              data-cy="validator-dialog-close-button"
            />
          </ModalHeader>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "530px" }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--s-4)" }}>
                <Title data-cy="details-dialog-validator-name"> {validator.metadata?.moniker ?? ""}</Title>
                <AddressTag address={validator.operator} copyable />
                <p> {validator.metadata?.website ?? ""}</p>
              </div>
              {validator.jailed_until ? (
                <div style={{ display: "flex", alignItems: "center", gap: "var(--s0)" }}>
                  <p style={{ color: "var(--color-error-alert)" }}>
                    {isJailedForever ? "Jailed forever" : null}
                    {isJailedWithExpiry ? `Jailed until ${jailedUntilDate.toLocaleDateString()}` : null}
                  </p>
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
                <Title>Distributed points</Title>
                <StyledInfoRow>
                  <b>{validator.engagementPoints} /</b> <p> {blockchainValues.totalEgPoints}</p>
                </StyledInfoRow>
              </StyledCard>
              <StyledCard>
                <Title>Distributed rewards, TGD</Title>
                <StyledInfoRow>
                  <b>{validator.rewards}</b>
                </StyledInfoRow>
                <Button
                  type="ghost"
                  onClick={() => setDistributionModalOpen(true)}
                  data-cy="validator-details-claim-rewards-button"
                >
                  Claim rewards
                </Button>
              </StyledCard>
              <StyledCard>
                <Title>Staked, TGD</Title>
                <Stack gap="s-4">
                  <b>{validator.liquidStaked} as liquid</b>
                  <b>{validator.vestedStaked} as vested</b>
                </Stack>
                {validator.operator === address ? (
                  <ButtonGroup>
                    <Button
                      type="ghost"
                      onClick={() => setStakeModalState({ open: true, operation: "unstake" })}
                      data-cy="validator-details-unstake-button"
                    >
                      Unstake
                    </Button>
                    <Button
                      onClick={() => setStakeModalState({ open: true, operation: "stake" })}
                      data-cy="validator-details-stake-button"
                    >
                      Stake
                    </Button>
                  </ButtonGroup>
                ) : null}
              </StyledCard>
              <StyledCard>
                <Title>Voting power</Title>
                <p data-cy="validator-detail-dialog-voting-power">{votingPower} %</p>
              </StyledCard>
            </div>
            <div style={{ marginTop: "25px", marginBottom: "10px" }}>
              <Title>Claims</Title>
            </div>
            <StyledTable
              pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
              dataSource={claims}
              columns={claimsColumns}
            />
            <div style={{ marginTop: "25px", marginBottom: "10px" }}>
              <Title>Slashing events</Title>
            </div>
            <StyledTable
              pagination={{ position: ["bottomCenter"], hideOnSinglePage: true }}
              dataSource={slashingEvents}
              columns={slashingEventsColumns}
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
