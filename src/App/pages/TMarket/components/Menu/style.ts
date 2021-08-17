import { Menu } from "antd";
import styled from "styled-components";

export default styled(Menu)`
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
