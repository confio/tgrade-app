import { Stack } from "App/components/layout";
import styled from "styled-components";

export const FormStack = styled(Stack)`
  & > * {
    --gap: var(--s7);
  }

  .ant-form-item {
    margin-bottom: 0;
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
