import { Button } from "antd";
import styled from "styled-components";

export const StyledButton = styled(Button)`
  /* display = flex for loading spinner */
  display: flex;

  padding: var(--s0) var(--s1);

  height: auto;
  border: none;
  border-radius: 6px;
  box-shadow: none;

  color: white;
  background-color: var(--bg-button-1ary);

  font-family: var(--ff-quicksand);
  font-size: var(--s0);
  font-weight: 500;
  line-height: var(--ratio);
  white-space: normal;

  &:hover,
  &:focus {
    color: white;
    background-color: var(--bg-button-1ary);
  }
`;
