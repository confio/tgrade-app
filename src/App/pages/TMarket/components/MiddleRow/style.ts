import { Row, Typography } from "antd";
import styled from "styled-components";

export const MiddleRowStyle = styled(Row)`
  row-gap: 0px;
  z-index: 4;
  background: var(--bg-body);
  height: 58px;
  margin: -6.7px 0;
  padding: 0 var(--s0);
`;
export const FeeLabel = styled(Typography.Text)`
  display: flex;
  column-gap: calc(var(--s0) / 2);
`;

export const TokenLabel = styled(Typography.Paragraph)`
  &.ant-typography {
    font-weight: 700;
    color: var(--color-text-1ary);
  }
`;
