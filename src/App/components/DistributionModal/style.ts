import { Modal } from "antd";
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

export const TextStack = styled(Stack)`
  max-width: 80ch;
  align-items: flex-start;

  & .ant-typography {
    text-align: left;
  }
`;
