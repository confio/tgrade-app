import { Typography } from "antd";
import styled from "styled-components";

export default styled.div`
  padding: calc(var(--s0) * 0.5);
  background: #8692a6;
  color: white;
  border-radius: 6px;
  border: 1px solid white;
`;

export const Title = styled(Typography.Title)`
  &.ant-typography {
    color: white;
    font-size: 18px;
  }
`;
export const Paragraph = styled(Typography.Paragraph)`
  &.ant-typography {
    color: white;
    font-size: 13px;
    line-height: 28px;
  }
`;
export const Img = styled.img`
  width: 10px;
  cursor: pointer;
`;
