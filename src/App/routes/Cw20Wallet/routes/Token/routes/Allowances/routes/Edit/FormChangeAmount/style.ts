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
