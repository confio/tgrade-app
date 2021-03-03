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

  background: var(--grad-primary);
  transform: ${({ open }) => (open ? "translateX(0%)" : "translateX(100%)")};
  transition: transform 0.3s ease-in-out;

  h3.ant-typography {
    color: white;
    margin: 0;
  }
`;

export const MenuLinks = styled.div`
  max-width: calc(var(--max-width) * 0.8);
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  img {
    cursor: pointer;
    align-self: flex-end;
    width: 1.75rem;
  }
`;
