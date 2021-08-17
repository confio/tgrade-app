import { Row } from "antd";
import Container, { Title, Paragraph } from "./style";
import { useProvide } from "service/provide";

const EmptyPoolTip = (): JSX.Element => {
  const { provideState } = useProvide();
  if (!provideState.isPoolEmpty) return <></>;
  return (
    <Container>
      <Row justify="start">
        <Title>Pair without liquidity!</Title>
      </Row>
      <Row justify="start">
        <Paragraph>This pool is empty by providing liquidity you are setting the price</Paragraph>
      </Row>
    </Container>
  );
};

export default EmptyPoolTip;
