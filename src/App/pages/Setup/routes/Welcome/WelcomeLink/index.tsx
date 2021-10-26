import { Typography } from "antd";
import * as React from "react";
import { LinkProps } from "react-router-dom";

import arrowRightIcon from "./assets/arrowRight.svg";
import { IconWrapper, StyledLink, TitleStack } from "./style";

const { Paragraph } = Typography;

interface WelcomeLinkProps extends LinkProps {
  readonly iconSrc: string;
  readonly iconAlt: string;
  readonly title: string;
  readonly subtitle: string;
}

export default function WelcomeLink({
  to,
  iconSrc,
  iconAlt,
  subtitle,
  title,
}: WelcomeLinkProps): JSX.Element {
  return (
    <StyledLink to={to}>
      <IconWrapper>
        <img src={iconSrc} alt={iconAlt} />
      </IconWrapper>
      <TitleStack gap="s-3">
        <Paragraph>{subtitle}</Paragraph>
        <Paragraph>{title}</Paragraph>
      </TitleStack>
      <img src={arrowRightIcon} alt="Right arrow icon" />
    </StyledLink>
  );
}
