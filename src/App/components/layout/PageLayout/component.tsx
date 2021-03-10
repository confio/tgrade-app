import { Typography } from "antd";
import { Center, Stack } from "App/components/layout";
import { BackButton, Burger, ErrorAlert } from "App/components/logic";
import { paths } from "App/paths";
import * as React from "react";
import { ComponentProps, HTMLAttributes, useState } from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { useWindowSize } from "utils/ui";
import { MenuWrapper, NavHeader } from "./style";

const { Title } = Typography;

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
  const { width } = useWindowSize();
  const isBigViewport = width >= 1040;

  const [isOpen, setOpen] = useState(false);

  const menuIsOpen = isBigViewport ? true : isOpen;
  const menuWidth = isBigViewport ? `300px` : "80%";
  const menuCloseIcon = isBigViewport ? false : undefined;

  return (
    <>
      {hide !== "header" && hide !== "menu" ? (
        <MenuWrapper data-background-big={isBigViewport}>
          <Menu
            isOpen={menuIsOpen}
            onClose={() => setOpen(false)}
            width={menuWidth}
            right={!isBigViewport}
            noOverlay={isBigViewport}
            noTransition={isBigViewport}
            customCrossIcon={menuCloseIcon}
          >
            <Link to={paths.account}>
              <Title level={3}>Account</Title>
            </Link>
            <Link to={paths.wallet.prefix}>
              <Title level={3}>Wallet</Title>
            </Link>
            <Link to={paths.cw20Wallet.prefix}>
              <Title level={3}>CW20 Wallet</Title>
            </Link>
            <Link to={paths.staking.prefix}>
              <Title level={3}>Staking</Title>
            </Link>
            <Link to={paths.logout}>
              <Title level={3}>Logout</Title>
            </Link>
          </Menu>
        </MenuWrapper>
      ) : null}
      <Center tag="main" {...props}>
        <Stack gap="s8">
          {hide !== "header" ? (
            <NavHeader>
              {hide !== "back-button" ? <BackButton {...backButtonProps} /> : null}
              {hide !== "menu" && !isBigViewport ? <Burger onClick={() => setOpen(true)} /> : null}
            </NavHeader>
          ) : null}
          <ErrorAlert />
          {children}
        </Stack>
      </Center>
    </>
  );
}
