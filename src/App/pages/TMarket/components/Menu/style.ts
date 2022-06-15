import { Menu as AntMenu } from "antd";
import styled from "styled-components";

export const Menu = styled(AntMenu)`
  font-family: var(--ff-text);
  font-size: var(--s0);
  color: var(--color-text-1ary);
  font-weight: 500;
  &.ant-menu {
    background: transparent;
    margin-bottom: var(--s0);
    display: flex;
    justify-content: center;

    li[role="menuitem"] {
      &.ant-menu-item-selected,
      &.ant-menu-item-active {
        color: var(--color-text-1ary);
        &::after {
          border-color: var(--color-primary);
        }
      }
    }
  }
`;
