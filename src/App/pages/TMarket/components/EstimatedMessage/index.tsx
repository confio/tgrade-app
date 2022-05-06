import { Row, Typography } from "antd";

const { Paragraph } = Typography;

const EstimatedMessage = (): JSX.Element => {
  return (
    <Row aria-label="estimated-message" style={{ marginTop: "var(--s2)" }}>
      <Paragraph style={{ marginBottom: "24px", textAlign: "left", fontSize: "var(--s-1)" }}>
        The displaying number is the simulated result and can be different from the actual swap rate. Trade at
        your own risk.
      </Paragraph>
    </Row>
  );
};
export default EstimatedMessage;
