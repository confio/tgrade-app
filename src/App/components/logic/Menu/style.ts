import { Stack } from "App/components/layout";
import { ComponentProps } from "react";
import styled from "styled-components";
import Menu from ".";

export const StyledMenu = styled.nav<ComponentProps<typeof Menu>>`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;

  display: flex;
  flex-direction: column;
  justify-content: center;

  width: 80vw;
  height: 100vh;
  height: -webkit-fill-available;
  padding: 2rem;
  text-align: left;

  background: linear-gradient(
    90deg,
    rgba(113, 100, 246, 1) 0%,
    rgba(125, 97, 243, 1) 12%,
    rgba(174, 117, 231, 1) 33%,
    rgba(90, 67, 245, 1) 49%,
    rgba(66, 160, 255, 1) 91%
  );
  transform: ${({ open }) => (open ? "translateX(0%)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;

  h3.ant-typography {
    color: white;
    margin: 0;
  }
`;

export const MenuStack = styled(Stack)`
  max-width: calc(var(--max-width) * 0.8);

  img {
    cursor: pointer;
    align-self: flex-end;
    width: 1.75rem;
  }
`;
