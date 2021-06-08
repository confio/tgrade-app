import { Typography } from "antd";
import * as React from "react";
import { ComponentProps } from "react";
import { Link } from "react-router-dom";
import { BackButton } from "..";
import backArrow from "./assets/backArrow.svg";
import { ArrowTextContainer, StyledButton } from "./style";

const { Text } = Typography;

type BackButtonOrLinkProps = ComponentProps<typeof BackButton> & {
  readonly onClick?: () => void;
  readonly disabled?: boolean;
};

function BackContent({ text }: BackButtonOrLinkProps): JSX.Element {
  return (
    <ArrowTextContainer>
      <img src={backArrow} alt="Back arrow" />
      <Text>{text}</Text>
    </ArrowTextContainer>
  );
}

export default function BackButtonOrLink({
  onClick,
  disabled,
  path: pathname,
  state,
  text,
}: BackButtonOrLinkProps): JSX.Element {
  return onClick ? (
    <StyledButton disabled={disabled} onClick={disabled ? () => {} : onClick}>
      <BackContent text={text} />
    </StyledButton>
  ) : (
    <Link to={{ pathname, state }}>
      <BackContent text={text} />
    </Link>
  );
}
