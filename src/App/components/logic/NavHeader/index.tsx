import BackButton from "../BackButton";
import * as React from "react";
import { ComponentProps, HTMLAttributes } from "react";
import { StyledNav } from "./style";

interface NavHeaderProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
}

export default function NavHeader({
  backButtonProps,

  ...props
}: NavHeaderProps): JSX.Element {
  const showBackButton = !!backButtonProps;
  const showHeader = showBackButton;

  return (
    <>
      {showHeader ? (
        <StyledNav {...props}>{showBackButton ? <BackButton {...backButtonProps} /> : null}</StyledNav>
      ) : null}
    </>
  );
}
