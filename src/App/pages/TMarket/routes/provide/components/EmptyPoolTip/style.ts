import { Typography } from "antd";
import styled from "styled-components";

export default styled.div`
  padding: calc(var(--s0) * 0.5);
  border-radius: 6px;
`;

export const Title = styled(Typography.Title)`
  &.ant-typography {
    color: rgba(255, 100, 101, 1);
    font-size: 16px;
  }
`;
export const Paragraph = styled(Typography.Paragraph)`
  &.ant-typography {
    color: rgba(255, 100, 101, 1);
    font-size: 13px;
    line-height: 28px;
  }
`;
export const Img = styled.img`
  width: 10px;
  cursor: pointer;
`;
