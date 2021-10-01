import { Modal } from "antd";
import styled from "styled-components";

export default styled(Modal)`
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

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;

  & > span.ant-typography {
    margin-right: var(--s0);
  }

  & span.ant-typography > span.ant-typography {
    cursor: pointer;
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: underline;
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
