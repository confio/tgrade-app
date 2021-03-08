import { Typography } from "antd";
import { paths } from "App/paths";
import * as React from "react";
import { HTMLAttributes } from "react";
import { slide as BurgerMenu } from "react-burger-menu";
import { Link } from "react-router-dom";
import { MenuWrapper } from "./style";

const { Title } = Typography;

interface MenuProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly isBigViewport: boolean;
  readonly isOpen: boolean;
  readonly closeMenu: () => void;
}

export default function Menu({ isBigViewport, isOpen, closeMenu, ...restProps }: MenuProps): JSX.Element {
  const menuIsOpen = isBigViewport ? true : isOpen;
  const menuWidth = isBigViewport ? `300px` : "80%";
  const menuCloseIcon = isBigViewport ? false : undefined;

  return (
    <MenuWrapper data-background-big={isBigViewport} {...restProps}>
      <BurgerMenu
        isOpen={menuIsOpen}
        onClose={closeMenu}
        width={menuWidth}
        right={!isBigViewport}
        noOverlay={isBigViewport}
        noTransition={isBigViewport}
        customCrossIcon={menuCloseIcon}
      >
        <Link to={paths.account} onClick={closeMenu}>
          <Title level={3}>Account</Title>
        </Link>
        <Link to={paths.wallet.prefix} onClick={closeMenu}>
          <Title level={3}>Wallet</Title>
        </Link>
        <Link to={paths.cw20Wallet.prefix} onClick={closeMenu}>
          <Title level={3}>CW20 Wallet</Title>
        </Link>
        <Link to={paths.staking.prefix} onClick={closeMenu}>
          <Title level={3}>Staking</Title>
        </Link>
        <Link to={paths.logout} onClick={closeMenu}>
          <Title level={3}>Logout</Title>
        </Link>
      </BurgerMenu>
    </MenuWrapper>
  );
}
