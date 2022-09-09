import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const DelegateStack = styled(Stack)`
  text-align: left;

  & input {
    max-width: 32.25rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: var(--s0);
`;
