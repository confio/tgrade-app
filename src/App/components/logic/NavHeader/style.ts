import styled from "styled-components";

export const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & [alt="Back arrow"] {
    margin-right: auto;
  }

  & [aria-label="Toggle menu"] {
    margin-left: auto;
  }
`;
