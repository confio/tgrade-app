import { Modal, Typography } from "antd";
import { Stack } from "App/components/layoutPrimitives";
import { Button } from "App/components/form";
import styled from "styled-components";

const { Text } = Typography;

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
  flex-wrap: wrap;

  & > * {
    flex-basis: 33%;
  }
`;

export const TextLabel = styled(Text)`
  && {
    color: var(--color-text-1ary);
    font-weight: 500;
  }
`;

export const TextValue = styled(Text)`
  && {
    color: var(--color-text-1ary);
  }
`;

export const ChangedField = styled(Typography)`
  margin-top: var(--s-1);

  & > * {
    display: block;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;

  & .ant-btn {
    margin-right: var(--s0);
    display: flex;
    justify-content: center;
    width: 8rem;
  }

  & .ant-btn:last-child {
    margin-right: 0;
  }
`;

export const FeeGroup = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & > *:first-child {
    margin-right: var(--s0);
  }
`;

export const YesButton = styled(Button)`
  &,
  &:hover,
  &:focus {
    background-color: var(--bg-button-1ary);
  }
`;

export const NoButton = styled(Button)`
  &,
  &:hover,
  &:focus {
    background-color: var(--bg-button-danger);
  }
`;

export const AbstainButton = styled(Button)`
  &,
  &:hover,
  &:focus {
    background-color: var(--bg-button-2ary);
  }
`;
