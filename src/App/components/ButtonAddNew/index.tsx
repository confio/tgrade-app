import { Typography } from "antd";
import * as React from "react";
import { HTMLAttributes } from "react";
import addIcon from "./assets/add.svg";
import StyledButtonAddNew from "./style";

const { Text } = Typography;

interface ButtonAddNewProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly text: string;
}

export default function ButtonAddNew({ text, ...props }: ButtonAddNewProps): JSX.Element {
  return (
    <StyledButtonAddNew {...props}>
      <img src={addIcon} alt="Add new" />
      <Text>{text}</Text>
    </StyledButtonAddNew>
  );
}
