import * as React from "react";
import { ComponentProps } from "react";
import { StyledBurger } from "./style";

export default function Burger({
  open,
  setOpen,
  ...props
}: ComponentProps<typeof StyledBurger>): JSX.Element {
  return (
    <StyledBurger aria-label="Toggle menu" open={open} onClick={() => setOpen(!open)} {...props}>
      <span />
      <span />
      <span />
    </StyledBurger>
  );
}
