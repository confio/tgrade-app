import { Center } from "App/components/layout";
import styled from "styled-components";

export const StyledCenter = styled(Center)`
  flex-grow: 1;
  padding: clamp(var(--s0), calc(2vw + var(--s0)), var(--s4));
  overflow: hidden;

  & > * + * {
    margin-top: clamp(var(--s-2), calc(2vw + var(--s-2)), var(--s2));
  }
`;

export const StyledMain = styled(Center)`
  --max-width: 29rem;
  max-width: var(--max-width);
  height: 100%;
  display: flex;
  justify-content: center;
`;
