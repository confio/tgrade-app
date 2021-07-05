import { Stack } from "App/components/layoutPrimitives";
import styled from "styled-components";

export const TextStack = styled(Stack)`
  & h1.ant-typography,
  & h1.ant-typography + div.ant-typography {
    text-align: left;
  }

  & div.ant-typography {
    line-height: 1.75rem;
  }
`;
