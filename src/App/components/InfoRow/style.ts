import { Row, Tooltip, Typography } from "antd";
import styled from "styled-components";

export default styled(Row)`
  display: grid;
  grid-template-columns: 60% 40%;
  column-gap: var(--s0);
  padding: 2px 0;
`;

export const Label = styled(Typography.Paragraph)`
  &.ant-typography {
    font-size: calc(var(--s0) * 0.85);
    color: var(--color-text-1ary);
    font-family: var(--ff-text);
    text-align: end;
  }
`;
export const Value = styled(Typography.Paragraph)`
  &.ant-typography {
    text-align: start;
    font-size: calc(var(--s0) * 0.85);
    color: hsla(0, 0%, 0%, 1);
    font-family: var(--ff-text);
    svg {
      fill: var(--color-button-2ary);
    }
  }
`;
export const StyledToolTip = styled(Tooltip)`
  padding-left: calc(var(--s0) / 2);
`;
