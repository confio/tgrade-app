import styled from "styled-components";
import { Radio } from "antd";

export const StyledButton = styled(Radio)`
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin: 15px;
  background: #0bb0b1;
  &:checked + label {
    background: #0bb0b1;
    color: #000;
  }
`;
