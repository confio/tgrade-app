import { QuestionCircleFilled } from "@ant-design/icons";
import Row, { Label, Value, StyledToolTip } from "./style";

const InfoRow = (props: { label: string; value: string; tooltip?: any }): JSX.Element => {
  return (
    <Row>
      <Label>{props.label}:</Label>
      <Value>
        {props.value}
        {props.tooltip ? (
          <StyledToolTip color={"#8692A6"} placement="right" title={props.tooltip}>
            <QuestionCircleFilled />
          </StyledToolTip>
        ) : null}
      </Value>
    </Row>
  );
};
export default InfoRow;
