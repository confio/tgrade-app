import { Typography } from "antd";
import addIcon from "App/assets/icons/add.svg";
import * as React from "react";
import { HTMLAttributes } from "react";

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
