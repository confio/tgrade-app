import { Modal } from "antd";
import { Stack } from "App/components/layout";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
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
  align-items: center;
  justify-content: space-between;

  & h1 {
    font-size: var(--s3);
    font-weight: 500;
    line-height: 2.35rem;
  }

  & img {
    cursor: pointer;
    height: 1.25rem;
  }
`;

export const Separator = styled.hr`
  border: none;
  border-top: var(--color-input-border);
`;

export const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & .ant-form-item {
    flex-basis: 18rem;
  }
`;
