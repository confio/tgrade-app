import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

const { Text } = Typography;

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

export const IssuerStack = styled(Stack)`
  align-items: flex-start;
`;

export const IssuerText = styled(Text)`
  && {
    color: var(--color-text-1ary);
  }
`;

export const FieldWrapper = styled.div`
  max-width: min(28.5rem, 100%);
`;
