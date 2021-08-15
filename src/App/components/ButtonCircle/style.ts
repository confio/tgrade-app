import { Button } from "antd";
import styled from "styled-components";

export const ButtonCircle = styled(Button)`
  color: var(--bg-button-1ary);
  width: calc(var(--s6) * 0.9);
  height: fit-content;
  background: white;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.07);
  padding: var(--s0);
  display: flex;
  justify-content: center;
  align-items: center;
`;
