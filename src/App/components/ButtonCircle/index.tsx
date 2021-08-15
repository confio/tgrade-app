import { AntTreeNodeProps } from "antd/lib/tree";
import { ButtonCircle } from "./style";

const ButtonCircleComponent = (props: AntTreeNodeProps): JSX.Element => {
  return (
    <ButtonCircle shape="circle" onClick={props.onClick}>
      {props.children}
    </ButtonCircle>
  );
};

export default ButtonCircleComponent;
