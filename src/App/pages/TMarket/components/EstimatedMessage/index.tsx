import { Row, Typography } from "antd";

const { Paragraph } = Typography;

const EstimatedMessage = (): JSX.Element => {
  return (
    <Row justify="center">
      <Paragraph style={{ marginBottom: "24px", textAlign: "center", fontSize: "var(--s-1)" }}>
        The displaying number is the simulated result and can be different from the actual swap rate. Trade at
        your own risk.
      </Paragraph>
    </Row>
  );
};
export default EstimatedMessage;
