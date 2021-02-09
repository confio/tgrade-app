import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s5);
  }
`;

export const ButtonStack = styled(Stack)`
  & > * {
    --gap: var(--s0);
  }
`;
