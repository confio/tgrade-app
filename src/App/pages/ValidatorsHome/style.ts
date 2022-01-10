import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const TextStack = styled(Stack)`
  align-self: flex-start;
  max-width: 80ch;
  align-items: flex-start;

  & .ant-typography {
    text-align: left;
  }
`;
