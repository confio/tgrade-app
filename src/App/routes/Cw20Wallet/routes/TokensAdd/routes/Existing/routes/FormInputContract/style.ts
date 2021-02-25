import { Stack } from "App/components/layout";
import styled from "styled-components";

export const FormStack = styled(Stack)`
  & > * {
    --gap: var(--s2);
  }
`;
