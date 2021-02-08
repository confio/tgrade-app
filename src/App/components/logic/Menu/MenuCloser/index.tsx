import { ComponentProps } from "react";
import Menu from "..";
import { StyledCloseBox } from "./style";

export default function MenuCloser({ open, setOpen }: ComponentProps<typeof Menu>): JSX.Element {
  return open ? <StyledCloseBox onClick={() => setOpen(false)} /> : <></>;
}
