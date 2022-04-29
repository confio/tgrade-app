import { Typography } from "antd";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

const { Text } = Typography;

export const ResultText = styled(Text)`
  &.ant-typography {
    color: var(--color-primary);
    font-size: var(--s3);
    line-height: var(--s4);
    font-weight: 700;
  }
`;

export const ResultDescription = styled(Text)`
  &.ant-typography {
    color: var(--color-primary);
    font-size: var(--s1);
    line-height: var(--s2);
  }
`;

export const ResultIcon = styled.img`
  width: 4.75rem;
  align-self: center;
`;

export const ButtonStack = styled(Stack)`
  align-self: center;

  .ant-btn {
    justify-content: center;
    width: 10rem;
  }
`;
