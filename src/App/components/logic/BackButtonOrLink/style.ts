import styled from "styled-components";

export const StyledButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  outline: inherit;
`;
export const ArrowTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & img[alt="Back arrow"] {
    width: 0.833125rem;

    & + span.ant-typography {
      margin-left: var(--s-1);
      line-height: calc(var(--ratio) * 2);
      font-weight: 500;
    }
  }
`;
