import styled from "styled-components";

export const StyledButton = styled.button`
  cursor: pointer;
  align-self: right;
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  width: 2rem;
  height: 2rem;

  background: transparent;
  border: none;
  padding: 0;

  span {
    position: relative;

    width: 2rem;
    height: 0.25rem;

    border-radius: 0.625rem;
    background: var(--grad-primary);
  }
`;
