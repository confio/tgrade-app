import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const CheckStack = styled(Stack)`
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: var(--s0);
  text-align: left;

  & > span.ant-typography {
    color: var(--color-text-1ary);
  }

  & input {
    max-width: 32.25rem;
  }
`;

export const BoldText = styled(Typography.Text)`
  font-weight: bolder;
`;

export const Row = styled.div`
  display: flex;
`;

export const Cell = styled(Stack)`
  flex-basis: 50%;

  & span.ant-typography {
    color: var(--color-text-1ary);
  }
`;
