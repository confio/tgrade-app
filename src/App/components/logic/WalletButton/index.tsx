import { Typography } from "antd";
import * as React from "react";
import { HTMLAttributes } from "react";
import arrowRightIcon from "./assets/arrowRight.svg";
import StyledWalletButton, { IconWrapper } from "./style";

const { Text } = Typography;

interface WalletButtonProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly iconSrc: string;
  readonly iconAlt: string;
  readonly text: string;
}

export default function WalletButton({
  iconSrc,
  iconAlt,
  text,
  ...restProps
}: WalletButtonProps): JSX.Element {
  return (
    <StyledWalletButton {...restProps}>
      <IconWrapper>
        <img src={iconSrc} alt={iconAlt} />
      </IconWrapper>
      <Text>{text}</Text>
      <img src={arrowRightIcon} alt="Right arrow icon" />
    </StyledWalletButton>
  );
}
