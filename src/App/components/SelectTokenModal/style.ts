import { Menu, Modal } from "antd";
import styled from "styled-components";

export default styled(Modal)`
  ${({ bgTransparent }: { bgTransparent?: boolean }) =>
    bgTransparent &&
    `
  & .ant-modal-content {
    background: none;
    box-shadow: none;
  }
  `};
  & .ant-modal-content {
    border-radius: var(--s0);
    .ant-modal-body {
      border-radius: var(--s0);
    }
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 20px;

  & h1 {
    font-size: var(--s1);
    font-weight: 500;
    line-height: 26px;
  }

  & span.ant-typography {
    color: var(--color-text-1ary);
  }

  & .exit {
    position: absolute;
    top: 0;
    right: -40px;
    height: 1.25rem;
  }
  & img {
    cursor: pointer;
  }
`;

export const SelectTokensMenu = styled(Menu)`
  font-family: var(--ff-text);
  font-size: var(--s0);
  color: var(--color-text-1ary);
  font-weight: 600;

  &.ant-menu {
    background: transparent;
    margin-bottom: var(--s0);
    margin-left: -20px;
    margin-right: -20px;
    display: flex;
    justify-content: flex-start;

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
