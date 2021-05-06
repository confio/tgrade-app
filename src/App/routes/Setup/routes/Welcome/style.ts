import { Stack } from "App/components/layout";
import styled from "styled-components";

export const TextStack = styled(Stack)`
  & h1.ant-typography,
  & h1.ant-typography + div.ant-typography {
    text-align: left;
  }
`;
