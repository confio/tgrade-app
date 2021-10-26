import { Col, Row } from "antd";
import { setDisplayTip, useProvide } from "service/provide";

import exitIcon from "./asset/cross.svg";
import Container, { Img, Paragraph, Title } from "./style";

const Tip = (): JSX.Element => {
  const { provideState, provideDispatch } = useProvide();
  if (!provideState.displayTip) return <></>;
  const onExit = () => setDisplayTip(provideDispatch, !provideState.displayTip);
  return (
    <Container>
      <Row>
        <Col span={23}>
          <Title>Tip:</Title>
        </Col>

        <Img onClick={onExit} width={10} src={exitIcon} alt="exit" />
      </Row>
      <Row justify="center">
        <Paragraph>
          By adding liquidity you'll earn 0.30% of all trades on this pair proportional to your share of the
          pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your
          liquidity. More details are here .
        </Paragraph>
      </Row>
    </Container>
  );
};

export default Tip;
