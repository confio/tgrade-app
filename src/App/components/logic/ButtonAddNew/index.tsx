import { Typography } from "antd";
import * as React from "react";
import { HTMLAttributes } from "react";
import addIcon from "./assets/add.svg";
import { ContainerAddNew } from "./style";

const { Text } = Typography;

interface ButtonAddNewProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly text: string;
}

export default function ButtonAddNew({ text, ...props }: ButtonAddNewProps): JSX.Element {
  return (
    <ContainerAddNew {...props}>
      <img src={addIcon} alt="Add new" />
      <Text>{text}</Text>
    </ContainerAddNew>
  );
}
