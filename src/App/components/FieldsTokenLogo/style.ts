import styled from "styled-components";

export const StyledFieldsTokenLogo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--s0);

  img[alt="Token logo"] {
    margin-top: var(--s2);
    width: 100%;
    height: 100%;
    max-width: 52px;
    max-height: 52px;
  }

  img[alt="Remove logo"] {
    cursor: pointer;
    margin-top: var(--s2);
    height: 1rem;
  }
`;
