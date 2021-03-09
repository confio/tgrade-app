import * as React from "react";
import { ComponentProps } from "react";
import { Amount } from "./style";

export default function TokenAmount({ children, ...restProps }: ComponentProps<typeof Amount>): JSX.Element {
  return <Amount {...restProps}>{children}</Amount>;
}
