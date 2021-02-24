import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s1);
  }
`;

export const FormStack = styled(Stack)`
  & > * {
    --gap: var(--s2);
  }

  .ant-form-item {
    margin-bottom: 0;
  }

  button {
    margin-top: var(--s2);
  }
`;

export const FormField = styled.div`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: var(--s0);
  }

  span.ant-typography {
    font-family: var(--ff-iceland);
    font-size: var(--s2);
    flex-basis: 30%;
    flex-shrink: 0;
    word-wrap: break-word;
    text-align: left;
  }

  .ant-form-item {
    flex-basis: 70%;
    flex-shrink: 1;
  }
`;
