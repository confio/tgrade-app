import { Stack } from "App/components/layout";
import styled from "styled-components";

export const FormStack = styled(Stack)`
  & > * {
    --gap: var(--s2);
  }

  & .ant-form-item .ant-form-item-control-input-content {
    &:hover {
      color: #43547d;
      border: 1px solid #43547d;
    }
  }
`;
