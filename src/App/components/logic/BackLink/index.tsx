import { Typography } from "antd";
import * as React from "react";
import { ComponentProps } from "react";
import { BackButton } from "..";
import { Link } from "react-router-dom";
import backArrow from "./assets/backArrow.svg";
import { ArrowTextContainer } from "./style";

const { Text } = Typography;

type BackLinkProps = ComponentProps<typeof BackButton>;

export default function BackLink({ path: pathname, state, text }: BackLinkProps): JSX.Element {
  return (
    <Link to={{ pathname, state }}>
      <ArrowTextContainer>
        <img src={backArrow} alt="Back arrow" />
        <Text>{text}</Text>
      </ArrowTextContainer>
    </Link>
  );
}
