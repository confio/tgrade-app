import closeIcon from "App/assets/icons/cross.svg";
import Button from "App/components/Button";
import Stack from "App/components/Stack/style";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSdk } from "service";
import { ValidatorContractQuerier, ValidatorSlashing } from "utils/validator";

import DistributionModal from "../DistributionModal";
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

interface ModalProps {
  visible: boolean;
  validator?: ValidatorType;
  onCancel: () => void;
  blockchainValues: any;
}
const columns = [
  {
    title: "Execution date",
    key: "date",
  },
  {
    title: "Jailing",
    key: "jailing",
  },
  {
    title: "Slashing",
    key: "slashing",
  },
  {
    title: "Tx Hash",
    key: "txhash",
  },
  {
    title: "Reason",
    key: "reason",
  },
];
export function ValidatorDetail({
  visible,
  validator,
  blockchainValues,
  onCancel,
}: ModalProps): JSX.Element | null {
  const {
    sdkState: { config, client, address },
  } = useSdk();
  const [stakeModalState, setStakeModalState] = useState<StakeModalState>({ open: false });
  const [isDistributionModalOpen, setDistributionModalOpen] = useState(false);
  const [slashingEvents, setSlashingEvents] = useState<readonly ValidatorSlashing[]>([]);

  useEffect(() => {
    (async function getSlashingEvents() {
      if (!validator || !client) return;

      try {
        const validatorContract = new ValidatorContractQuerier(config, client);
        const slashingEvents = await validatorContract.getSlashingEvents(validator.operator);
        setSlashingEvents(slashingEvents);
      } catch {
        console.log(`${validator.operator} does not have slashing events`);
      }
    })();
  }, [client, config, validator]);

  if (!validator) return null;
  return (
    <StyledModal
      centered
      footer={null}
      closable={false}
      visible={visible}
      width="100%"
      style={{
        right: "-40px",
        maxWidth: "63.25rem",
        paddingRight: "60px",
      }}
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        borderRadius: "16px",
        backgroundColor: "transparent",
      }}
    >
      <ModalHeader>
        <Stack gap="s1"></Stack>

        <img alt="Close button" src={closeIcon} onClick={onCancel} />
      </ModalHeader>
      <div style={{ display: "flex", flexDirection: "column", marginRight: "50px", height: "530px" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column", marginRight: "50px" }}>
            <Title> {validator.metadata?.moniker ?? ""}</Title>
            <p> {validator.operator}</p>
            <p> {validator.metadata?.website ?? ""}</p>
          </div>
          {validator.jailed_until ? (
            <div style={{ display: "flex", flexDirection: "column", marginRight: "50px" }}>
              <p>Jailed</p>
              <p>{moment.unix(validator.jailed_until).format("DD/MM/YYYY")}</p>
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
              Claim rewards
            </Button>
          </StyledCard>
          <StyledCard>
            <Title>Staked, TGD</Title>
            <StyledInfoRow>
              <b>{validator.staked || "-"} /</b> <p> {blockchainValues.totalTGD}</p>
            </StyledInfoRow>
            {validator.operator === address ? (
              <ButtonGroup>
                <Button type="ghost" onClick={() => setStakeModalState({ open: true, operation: "unstake" })}>
                  Unstake
                </Button>
                <Button onClick={() => setStakeModalState({ open: true, operation: "stake" })}>Stake</Button>
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
      <StakeModal modalState={stakeModalState} setModalState={setStakeModalState} />
      <DistributionModal isModalOpen={isDistributionModalOpen} setModalOpen={setDistributionModalOpen} />
    </StyledModal>
  );
}
