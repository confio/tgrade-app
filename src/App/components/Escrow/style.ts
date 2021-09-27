import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const StyledEscrow = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;

  display: flex;
  justify-content: space-between;

  h2.ant-typography {
    font-size: var(--s0);
  }
`;

export const TotalEscrowStack = styled(Stack)`
  padding: var(--s1);
  flex-basis: calc(3 * (100% / 5));
  text-align: left;

  & [data-chart-source-type="G2Plot"] {
    align-self: center;
  }
`;

export const YourEscrowStack = styled(Stack)`
  border-left: 1px solid var(--color-border);
  padding: var(--s1);
  flex-basis: calc(2 * (100% / 5));
  text-align: left;

  & button {
    display: flex;
    justify-content: center;
  }
`;

export const AmountStack = styled(Stack)`
  & span.ant-typography {
    color: var(--color-text-2ary);
    font-weight: 500;
  }

  & > span.ant-typography:nth-child(1) {
    color: var(--color-text-1ary);
    font-size: var(--s-1);
  }
`;
