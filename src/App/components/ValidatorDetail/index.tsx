import { ellipsifyAddress } from "utils/ui";

import { StyledTable } from "./style";
import { StyledModal, Title } from "./style";
interface ModalProps {
  visible: boolean;
  validator: any;
  onCancel: () => void;
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
export function ValidatorDetail({ visible, validator, onCancel }: ModalProps): JSX.Element {
  return (
    <StyledModal
      bodyStyle={{
        position: "relative",
        padding: "var(--s1)",
        margin: "30px",
        borderRadius: "16px",
        backgroundColor: "transparent",
      }}
      footer={null}
      onCancel={onCancel}
      visible={visible}
      centered
      closable
      width="950px"
    >
      <div style={{ display: "flex", flexDirection: "column", marginRight: "50px", height: "530px" }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column", marginRight: "50px" }}>
            <Title> {validator.metadata.moniker}</Title>
            <p> {ellipsifyAddress(validator.operator)}</p>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "solid 1px #ECEEF2",
              width: "25%",
              height: "125px",
            }}
          >
            <p>Engagement points</p>
            <p>{validator.engagementPoints}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "solid 1px #ECEEF2",
              width: "25%",
              height: "125px",
            }}
          >
            <p>Engagement rewards, TGD</p>
            <p>{validator.rewards}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "solid 1px #ECEEF2",
              width: "25%",
              height: "125px",
            }}
          >
            <p>Staked, TGD</p>
            <p>{validator.staked}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "solid 1px #ECEEF2",
              width: "25%",
              height: "125px",
            }}
          >
            <p>Potential voting power</p>
            <p>{validator.power}</p>
          </div>
        </div>
        <div>
          <p>Slashing events</p>
        </div>
        <StyledTable columns={columns} pagination={false} />
      </div>
    </StyledModal>
  );
}
