import { Typography } from "antd";
import BackButtonOrLink from "../BackButtonOrLink";
import * as React from "react";
import { ComponentProps, HTMLAttributes } from "react";
import { StyledHeader, TitleStack } from "./style";

const { Title } = Typography;

interface HeaderBackProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly backButtonProps?: ComponentProps<typeof BackButtonOrLink>;
  readonly backButtonTitle?: string;
  readonly viewTitle?: string;
  readonly viewSubtitle?: string;
}

export default function HeaderBack({
  backButtonProps,
  viewSubtitle,
  viewTitle,
}: HeaderBackProps): JSX.Element {
  const showBackButton = !!backButtonProps;
  const showHeader = showBackButton || viewSubtitle || viewTitle;

  return (
    <>
      {showHeader ? (
        <StyledHeader>
          {showBackButton ? <BackButtonOrLink {...backButtonProps} /> : null}
          <TitleStack>
            <Title level={3}>{viewSubtitle ?? ""}</Title>
            <Title level={2}>{viewTitle ?? ""}</Title>
          </TitleStack>
        </StyledHeader>
      ) : null}
    </>
  );
}
