import { Stack } from "App/components/layout";
import styled from "styled-components";

export const FormStack = styled(Stack)`
  & > * {
    --gap: var(--s0);
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
  align-items: baseline;

  span.ant-typography {
    font-family: var(--ff-iceland);
    font-size: var(--s2);
    flex-basis: 20%;
    flex-shrink: 0;
    word-wrap: break-word;
    text-align: left;
  }

  .ant-form-item {
    flex-basis: 80%;
    flex-shrink: 1;
  }

  .ant-form-item + span.ant-typography {
    margin-left: var(--s0);
    flex-basis: 0;
  }
`;
