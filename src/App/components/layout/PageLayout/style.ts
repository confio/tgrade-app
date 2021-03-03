import styled from "styled-components";
import PageLayout from "./component";

export const StyledPageLayout = styled(PageLayout)`
  --max-width: min(100vw, 22rem);
  max-width: var(--max-width);
  overflow: hidden;

  padding: var(--s4);
  /* Reduces padding when width < var(--max-width), but uses em for better media query support */
  @media (max-width: 22em) {
    padding: var(--s-1) 0 var(--s-2) 0;
  }

  && > * {
    width: 100%;
  }
`;

export const NavHeader = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;

  [alt="Back arrow"] {
    margin-right: auto;
  }

  [aria-label="Toggle menu"] {
    margin-left: auto;
  }
`;
