import { Typography } from "antd";
import * as React from "react";
import { HTMLAttributes } from "react";
import { Link } from "react-router-dom";
import backArrow from "App/assets/icons/backArrow.svg";
import StyledBackContent, { StyledButton } from "./style";

const { Text } = Typography;

export interface BackProps {
  readonly path?: string;
  readonly state?: any;
  readonly text?: string;
}

type BackButtonOrLinkProps = HTMLAttributes<HTMLOrSVGElement> &
  BackProps & {
    readonly onClick?: () => void;
    readonly disabled?: boolean;
  };

function BackContent({ text }: BackButtonOrLinkProps): JSX.Element {
  return (
    <StyledBackContent>
      <img src={backArrow} alt="Back arrow" />
      <Text>{text}</Text>
    </StyledBackContent>
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
