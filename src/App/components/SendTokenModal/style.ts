import { Modal } from "antd";
import { Menu } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  & .ant-modal-content {
    border-radius: 16px;
  }

  ${({ bgTransparent }: { bgTransparent?: boolean }) =>
    bgTransparent &&
    `
  & .ant-modal-content {
    background: none;
    box-shadow: none;
  }
  `};
`;

export const FormStack = styled(Stack)`
  & .ant-btn {
    align-self: flex-end;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;

  & h1 {
    font-size: var(--s3);
    font-weight: 500;
    line-height: 2.35rem;
  }

  & span.ant-typography {
    color: var(--color-text-1ary);
  }

  & img {
    position: absolute;
    top: 0;
    right: -40px;
    cursor: pointer;
    height: 1.25rem;
  }
`;

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & .ant-form-item {
    flex-basis: 18rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;

  & .ant-btn {
    width: 50%;
    display: block;
  }
`;

export const StakeMenu = styled(Menu)`
  font-family: var(--ff-text);
  font-size: var(--s0);
  color: var(--color-text-1ary);
  font-weight: 600;

  &.ant-menu {
    background: transparent;
    margin-bottom: var(--s0);
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
