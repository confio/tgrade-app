import { BackButton, BurgerButton } from "App/components/logic";
import * as React from "react";
import { ComponentProps, HTMLAttributes } from "react";
import { StyledNav } from "./style";

interface NavHeaderProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly showBurgerButton: boolean;
  readonly burgerButtonCallback: () => void;
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
}

export default function NavHeader({
  backButtonProps,
  showBurgerButton,
  burgerButtonCallback,
  ...props
}: NavHeaderProps): JSX.Element {
  const showBackButton = !!backButtonProps;
  const showHeader = showBackButton || showBurgerButton;

  return (
    <>
      {showHeader ? (
        <StyledNav {...props}>
          {showBackButton ? <BackButton {...backButtonProps} /> : null}
          {showBurgerButton ? <BurgerButton onClick={burgerButtonCallback} /> : null}
        </StyledNav>
      ) : null}
    </>
  );
}
