import { Col } from "antd";
import { ReactChild } from "react";
import { useSdk } from "service";
import { FeeLabel, MiddleRowStyle, TokenLabel } from "./style";

const MiddleRow = ({ children }: { children: ReactChild }): JSX.Element => {
  const { sdkState } = useSdk();
  const { config } = sdkState;
  return (
    <MiddleRowStyle align="middle">
      <Col span={4}>
        <FeeLabel>
          Fee:<TokenLabel>{config.coinMap.utgd.denom}</TokenLabel>
        </FeeLabel>
      </Col>
      <Col style={{ marginLeft: "27.5%" }} span={5}>
        {children}
      </Col>
    </MiddleRowStyle>
  );
};
export default MiddleRow;
