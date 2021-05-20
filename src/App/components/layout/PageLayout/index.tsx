import { HeaderBack } from "App/components/logic";
import * as React from "react";
import { HTMLAttributes } from "react";
import { useLayout } from "service";
import { StyledCenter, StyledMain } from "./style";

export default function PageLayout({
  children,
  ...restProps
}: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  const {
    layoutState: { backButtonProps, viewTitles = {} },
  } = useLayout();
  const { viewTitle, viewSubtitle } = viewTitles;

  return (
    <StyledCenter {...restProps}>
      <HeaderBack backButtonProps={backButtonProps} viewTitle={viewTitle} viewSubtitle={viewSubtitle} />
      <StyledMain tag="main">{children}</StyledMain>
    </StyledCenter>
  );
}
