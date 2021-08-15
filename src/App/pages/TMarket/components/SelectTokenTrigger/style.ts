import { Button, Typography } from "antd";
import styled from "styled-components";

export default styled(Button)`
  width: 100%;
  margin-top: var(--s0);
  border-width: 0;
  background: inherit;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: start;
  box-shadow: none;
  color: var(--color-button-2ary);
  column-gap: 5px;
  svg {
    color: black;
  }
`;
export const SelectTokenParagraph = styled(Typography.Paragraph)`
  font-weight: 500;
`;
export const Image = styled.img`
  max-width: 40px;
`;
