import { Modal } from "antd";
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
