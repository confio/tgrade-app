import { Menu as AntMenu } from "antd";
import { ReactComponent as SoonIcon } from "App/assets/icons/soon.svg";
import styled from "styled-components";

export const Menu = styled(AntMenu)`
  font-family: var(--ff-text);
  font-size: var(--s1);
  color: var(--color-text-1ary);
  font-weight: 500;
  &.ant-menu {
    background: transparent;
    margin-bottom: var(--s0);
    display: flex;
    justify-content: space-between;

    li[role="menuitem"] {
      &.ant-menu-item-selected,
      &.ant-menu-item-active {
        color: var(--color-text-1ary);
        border-color: var(--color-primary);
      }
    }
  }
`;

export const StyledSoonIcon = styled(SoonIcon)`
  height: 18px;
  position: absolute;
  top: -3px;
  right: -18px;
`;
