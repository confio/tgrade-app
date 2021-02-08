import { Center, Stack } from "App/components/layout";
import { BackButton, Burger, Menu } from "App/components/logic";
import React, { ComponentProps, HTMLAttributes, useState } from "react";
import { NavHeader } from "./style";

interface PageLayoutProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly hide?: "header" | "back-button" | "menu";
  readonly backButtonProps?: ComponentProps<typeof BackButton>;
}

export default function PageLayout({
  hide,
  backButtonProps,
  children,
  ...props
}: PageLayoutProps): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <Center tag="main" {...props}>
      <Stack>
        {hide !== "header" ? (
          <NavHeader>
            {hide !== "back-button" ? <BackButton {...backButtonProps} /> : null}
            {hide !== "menu" ? <Burger open={open} setOpen={setOpen} /> : null}
            <Menu open={open} setOpen={setOpen} />
          </NavHeader>
        ) : null}
        {children}
      </Stack>
    </Center>
  );
}
