import { Stack } from "App/components/layoutPrimitives";
import styled from "styled-components";

export const StyledEscrow = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;

  display: flex;
  justify-content: space-between;

  h2.ant-typography {
    font-size: var(--s1);
  }
`;

export const TotalEscrowStack = styled(Stack)`
  padding: var(--s1);
  flex-basis: calc(2 * (100% / 3));
  text-align: left;
`;

export const YourEscrowStack = styled(Stack)`
  border-left: 1px solid var(--color-border);
  padding: var(--s1);
  flex-basis: calc(100% / 3);
  text-align: left;
`;
