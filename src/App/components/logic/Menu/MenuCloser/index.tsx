import Menu from "App/components/logic/Menu";
import * as React from "react";
import { ComponentProps } from "react";
import { StyledCloseBox } from "./style";

export default function MenuCloser({ open, setOpen }: ComponentProps<typeof Menu>): JSX.Element {
  return open ? <StyledCloseBox onClick={() => setOpen(false)} /> : <></>;
}
