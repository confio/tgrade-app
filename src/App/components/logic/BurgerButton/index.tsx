import * as React from "react";
import { HTMLAttributes } from "react";
import { StyledButton } from "./style";

export default function BurgerButton({ ...props }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  return (
    <StyledButton aria-label="Toggle menu" {...props}>
      <span />
      <span />
      <span />
    </StyledButton>
  );
}
