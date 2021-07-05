import { Stack } from "App/components/layoutPrimitives";
import styled from "styled-components";

export const MembersStack = styled(Stack)`
  padding: var(--s1);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;
  text-align: left;

  h2.ant-typography {
    font-size: var(--s1);
  }
`;
