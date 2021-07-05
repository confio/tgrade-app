import * as React from "react";
import { HTMLAttributes } from "react";
import { Spacing } from "theme/GlobalStyle/GlobalSpacing";

interface StackProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly tag?: keyof JSX.IntrinsicElements;
  readonly gap?: Spacing;
}

export default function Stack({ tag: Tag = "div", children, ...props }: StackProps): JSX.Element {
  return <Tag {...props}>{children}</Tag>;
}
