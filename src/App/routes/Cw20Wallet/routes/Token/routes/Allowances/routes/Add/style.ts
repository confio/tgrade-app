import { Stack } from "App/components/layout";
import styled from "styled-components";

export const MainStack = styled(Stack)`
  & > * {
    --gap: var(--s7);
  }

  h1 {
    margin: 0;
  }
`;

export const Amount = styled.div`
  span.ant-typography {
    font-size: var(--s2);
    font-family: var(--ff-iceland);
  }

  span.ant-typography + span.ant-typography {
    font-size: var(--s1);
  }
`;

export const FormStack = styled(Stack)`
  & > * {
    --gap: var(--s7);
  }

  .ant-form-item {
    margin-bottom: 0;
  }
`;

export const FormFieldsStack = styled(Stack)`
  & > * {
    --gap: var(--s2);
  }
`;

export const FormAmount = styled.div`
  display: flex;
  align-items: baseline;

  .ant-form-item {
    flex-grow: 1;
  }

  span.ant-typography {
    margin-left: var(--s0);
    font-family: var(--ff-iceland);
    font-size: var(--s1);
  }
`;
