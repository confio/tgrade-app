import Button from "App/components/Button";
import AddressTag from "App/components/AddressTag";
import styled from "styled-components";

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

export const StyledAddressTag = styled(AddressTag)`
  align-self: flex-start;
`;

export const ChooseButtons = styled.div`
  display: flex;
  flex-wrap: wrap;

  & button {
    flex-basis: calc(50% - calc(var(--s1) / 2));
  }

  & button + button {
    margin-left: var(--s1);
  }

  & .ant-btn {
    align-self: flex-start;
  }
`;

export const SwitchButtons = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > div {
    flex-basis: 50%;
  }

  & button {
    flex-basis: calc(50% - calc(var(--s1) / 2));
  }

  & button + button {
    margin-left: var(--s1);
  }

  & .ant-btn {
    align-self: flex-start;
  }
`;

export const LogoutButton = styled(Button)`
  align-self: flex-start;
`;
