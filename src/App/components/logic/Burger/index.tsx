import * as React from "react";
import { HTMLAttributes } from "react";
import { StyledBurger } from "./style";

export default function Burger({ ...props }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  return (
    <StyledBurger aria-label="Toggle menu" {...props}>
      <span />
      <span />
      <span />
    </StyledBurger>
  );
}
