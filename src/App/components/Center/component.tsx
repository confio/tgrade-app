import * as React from "react";
import { HTMLAttributes } from "react";

interface CenterProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly tag?: keyof JSX.IntrinsicElements;
}

export default function Center({ tag: Tag = "div", children, ...props }: CenterProps): JSX.Element {
  return <Tag {...props}>{children}</Tag>;
}
