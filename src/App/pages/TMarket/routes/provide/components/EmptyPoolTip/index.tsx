import { Row } from "antd";
import { useProvide } from "service/provide";

import Container, { Paragraph, Title } from "./style";

const EmptyPoolTip = (): JSX.Element => {
  const { provideState } = useProvide();
  if (!provideState.selectedPair && !provideState.isPoolEmpty) return <></>;
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
