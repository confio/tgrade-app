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

export const UploadLabel = styled.label`
  && {
    cursor: pointer;
    margin-top: var(--s2);
    height: 100%;
    color: var(--color-primary);
    font-size: var(--s0);
    font-family: var(--ff-text);
    font-weight: 500;

    display: flex;
    align-items: center;

    img {
      height: 1em;
      margin-right: var(--s-4);
    }
  }
`;
