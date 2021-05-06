import styled from "styled-components";
import { Center } from "..";

export const StyledCenter = styled(Center)`
  --max-width: 30rem;
  max-width: var(--max-width);
  overflow: hidden;

  padding: clamp(var(--s0), calc(2vw + var(--s0)), var(--s4));

  && > * {
    width: 100%;
  }
`;
