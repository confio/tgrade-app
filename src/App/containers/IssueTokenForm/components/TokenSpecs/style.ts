import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const Separator = styled.hr`
  margin: var(--s1) -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const FormStack = styled(Stack)`
  .ant-form-item {
    margin-bottom: 0;
  }
`;

export const NameWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s0);

  .ant-form-item {
    flex-basis: 17rem;
  }

  .ant-form-item + .ant-form-item {
    flex-basis: auto;
    flex-grow: 1;
  }
`;

export const LogoErrorText = styled(Typography.Text)`
  &.ant-typography {
    color: var(--color-error-form);
  }
`;
