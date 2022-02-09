import { Button, Collapse, Divider, Modal, Typography } from "antd";
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

export const TextLabel = styled(Typography.Text)`
  && {
    color: var(--color-text-1ary);
    font-weight: 500;
  }
`;

export const TextValue = styled(Typography.Text)`
  && {
    color: var(--color-text-1ary);
  }
`;

export const AddressField = styled(Typography)`
  margin-top: var(--s-1);
  display: flex;

  & * + * {
    margin-left: var(--s-2);
  }
`;

export const ChangedField = styled(Typography)`
  margin-top: var(--s-1);

  & > * {
    display: block;
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

export const Title = styled(Typography.Title)`
  &.ant-typography {
    color: #000;
    font-weight: 500;
    font-size: 30px;
  }
`;

export const Paragraph = styled.p`
  margin-left: 50px;
  & b {
    margin-left: 5px;
  }
`;

export const Text = styled(Typography.Text)`
  &.ant-typography {
    color: #000;
    font-weight: 500;
  }
`;

export const FormStack = styled(Stack)`
  & .ant-btn {
    align-self: flex-end;
  }
`;

export const ModalHeader = styled.header`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;

  & h1 {
    font-size: var(--s3);
    font-weight: 500;
    line-height: 2.35rem;
  }

  & span.ant-typography {
    line-height: 28px;
    color: #8692a6;
  }

  & img {
    position: absolute;
    top: 0;
    right: -40px;
    cursor: pointer;
    height: 1.25rem;
  }
`;

export const Separator = styled(Divider)`
  margin: 2px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  & > * {
    flex-basis: 33%;
  }
`;

export const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FeeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  align-items: flex-end;
  min-width: 100px;
`;

export const ParticipantsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & p {
    margin: 0;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  height: 82px;
  align-items: center;
  & button {
    height: 42px;
    flex-basis: calc(50% - calc(var(--s1) / 2));
  }

  & button + button {
    margin-left: var(--s1);
  }

  & .ant-btn {
  }
`;

export const AbstainedButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  min-width: 125px;
  background-color: #8692a6;
  color: #fff;
  &:hover {
    background-color: #8692a6;
    color: #000;
  }
`;

export const ExecuteButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  min-width: 125px;
  margin-left: 10px;
  height: 42px;
  background-color: #fff;
  color: #000;
  &:hover {
    background-color: #0bb0b1;
    color: #fff;
  }
`;

export const AcceptButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  width: 94px;
  background-color: #0bb0b1;
  color: #fff;
  &:hover {
    background-color: #0bb0b1;
    color: #000;
  }
`;

export const RejectButton = styled(Button)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 6px;
  font-size: 16px;
  width: 94px;
  background-color: #ff6465;
  color: #fff;
  &:hover {
    background-color: #ff6465;
    color: #000;
  }
`;

export const StyledCollapse = styled(Collapse)`
  flex-basis: 100%;

  &.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 0;
    display: flex;
    align-items: center;

    & > div {
      flex-basis: 100%;
    }
  }

  & .ant-collapse-content > .ant-collapse-content-box {
    padding: 0;
  }
`;
