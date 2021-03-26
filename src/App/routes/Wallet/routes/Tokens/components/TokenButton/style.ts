import styled from "styled-components";

export const TokenItem = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  & div {
    display: flex;
    align-items: center;

    .ant-btn {
      padding: var(--s-4);
      margin-right: var(--s-4);

      height: auto;
      background: none;
      border: 1px solid transparent;
      border-radius: 0.625rem;

      &:hover {
        border: 1px solid var(--color-form);
      }
    }
  }

  & span.ant-typography {
    color: currentColor;
    font-family: var(--ff-iceland);
    font-size: var(--s2);
  }

  && > span.ant-typography + span.ant-typography:last-child {
    font-family: var(--ff-montserrat);
    font-size: var(--s-1);
    font-weight: bolder;
  }
`;
