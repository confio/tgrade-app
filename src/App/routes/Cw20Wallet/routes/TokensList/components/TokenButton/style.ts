import styled from "styled-components";

export const ButtonWrapper = styled.div`
  &.ant-btn.ant-btn-primary[data-size="large"] {
    display: flex;
    align-items: center;
  }
`;

export const TokenAndAmount = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  & div {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  && > div + span.ant-typography {
    font-family: var(--ff-montserrat);
    font-size: var(--s-1);
    font-weight: bolder;
  }
`;

export const FavAndDenom = styled.div`
  & .ant-btn {
    padding: var(--s-4);
    margin-right: var(--s-4);

    height: auto;
    background: none;
    border: 1px solid transparent;
    border-radius: 0.625rem;

    &:hover,
    &:focus {
      border: 1px solid var(--color-form);
    }
  }

  & span.ant-typography {
    color: currentColor;
    font-family: var(--ff-iceland);
    font-size: var(--s2);
  }
`;
