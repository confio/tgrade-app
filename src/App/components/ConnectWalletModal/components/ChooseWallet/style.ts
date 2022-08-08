import AddressTag from "App/components/AddressTag";
import Button from "App/components/Button";
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
  gap: var(--s1);

  & button {
    flex-basis: calc(50% - calc(var(--s1) / 2));
  }

  & .ant-btn {
    align-self: flex-start;
  }
`;

export const SwitchButtons = styled.div`
  padding: 1px; /* So button hover border does not get cut*/
  height: 400px;
  display: flex;
  justify-content: space-between;
  gap: var(--s0);

  & > div:nth-child(1) {
    flex-basis: 70%;

    & > div {
      overflow-y: auto;
    }
  }

  & > div:nth-child(2) {
    flex-basis: 30%;

    & .ant-btn {
      align-self: flex-start;
    }
  }
`;

export const WalletConnected = styled.div`
  display: flex;
  align-items: center;
  gap: var(--s-3);

  & img {
    width: 100%;
    height: 100%;
    max-width: 20px;
    max-height: 20px;
  }

  & span.ant-typography {
    color: black;
  }
`;

export const LogoutButton = styled(Button)`
  display: block;
  width: 100%;
`;
