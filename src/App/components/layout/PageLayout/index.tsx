import { HeaderBack } from "App/components/logic";
import * as React from "react";
import { ComponentProps } from "react";
import { useLayout } from "service";
import StyledPageLayout, { StyledMain, StyledMainProps } from "./style";

export type PageLayoutProps = ComponentProps<typeof StyledPageLayout> & StyledMainProps;

export default function PageLayout({
  maxwidth,
  centered,
  children,
  ...restProps
}: PageLayoutProps): JSX.Element {
  const {
    layoutState: { backButtonProps, viewTitles = {} },
  } = useLayout();
  const { viewTitle, viewSubtitle } = viewTitles;

  return (
    <StyledPageLayout {...restProps}>
      <HeaderBack backButtonProps={backButtonProps} viewTitle={viewTitle} viewSubtitle={viewSubtitle} />
      <StyledMain maxwidth={maxwidth} centered={centered} tag="main">
        {children}
      </StyledMain>
    </StyledPageLayout>
  );
}
