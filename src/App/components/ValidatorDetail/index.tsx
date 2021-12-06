import closeIcon from "App/assets/icons/cross.svg";
import Stack from "App/components/Stack/style";

import { ModalHeader, StyledCard, StyledInfoRow, StyledModal, StyledTable, Title } from "./style";

interface ModalProps {
  visible: boolean;
  validator: any;
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
export function ValidatorDetail({ visible, validator, blockchainValues, onCancel }: ModalProps): JSX.Element {
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
      maskStyle={{ background: "rgba(4,119,120,0.9)" }}
    >
      <ModalHeader>
        <Stack gap="s1"></Stack>

        <img alt="Close button" src={closeIcon} onClick={onCancel} />
      </ModalHeader>
      <div style={{ display: "flex", flexDirection: "column", marginRight: "50px", height: "530px" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column", marginRight: "50px" }}>
            <Title> {validator.metadata.moniker}</Title>
            <p> {validator.operator}</p>
            <p> {validator.metadata.website}</p>
          </div>
          {validator.jailed_until ? (
            <div style={{ display: "flex", flexDirection: "column", marginRight: "50px" }}>
              <p>Jailed</p>
              <p>{validator.jailed_until}</p>
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
          </StyledCard>
          <StyledCard>
            <Title>Staked, TGD</Title>
            <StyledInfoRow>
              <b>{validator.staked || "-"} /</b> <p> {blockchainValues.totalTGD}</p>
            </StyledInfoRow>
          </StyledCard>
          <StyledCard>
            <Title>Potential voting power</Title>
            <p>{validator.power}</p>
          </StyledCard>
        </div>
        <div style={{ marginTop: "25px", marginBottom: "10px" }}>
          <Title>Slashing events</Title>
        </div>
        <StyledTable dataSource={validator.slashEvents} columns={columns} pagination={false} />
      </div>
    </StyledModal>
  );
}
