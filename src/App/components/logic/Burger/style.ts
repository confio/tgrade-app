import styled from "styled-components";

interface BurgerProps {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
}

export const StyledBurger = styled.button<BurgerProps>`
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

    border-radius: 10px;
    background: linear-gradient(
      90deg,
      rgba(113, 100, 246, 1) 0%,
      rgba(125, 97, 243, 1) 12%,
      rgba(174, 117, 231, 1) 33%,
      rgba(90, 67, 245, 1) 49%,
      rgba(66, 160, 255, 1) 91%
    );
  }
`;
