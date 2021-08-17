import { Col, Divider, Row, Typography } from "antd";
import Button from "App/components/Button";
import styled from "styled-components";

export const Container = styled(Col)`
  min-width: 340px;
`;
export const Title = styled(Typography.Title)`
  &.ant-typography {
    color: var(--color-gray-0-98);
  }
`;
export const ImageContainer = styled(Row)`
  margin-bottom: 60px;
  justify-content: center;
`;
export const TitleContainer = styled(Row)`
  margin-bottom: 16px;
  justify-content: center;
`;
export const HorizontalDivider = styled(Divider)`
  margin: var(--s0) 0;
  opacity: 0.5;
  background: var(--color-gray-0-98);
`;
export const RowContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
  padding: calc(var(--s0) / 2) 0;
`;
export const Paragraph = styled(Typography.Paragraph)`
  &.ant-typography {
    color: var(--color-gray-0-98);
    font-size: calc(var(--s0) * 0.85);
  }
`;
export const ParagraphStrong = styled(Typography.Paragraph)`
  &.ant-typography {
    color: var(--color-gray-0-98);
    font-weight: 700;
    font-size: calc(var(--s0) * 0.85);
  }
`;
export const OkButton = styled(Button)`
  width: 100%;
  margin: var(--s4) 0;
  border-radius: 50px;
  display: flex;
  justify-content: center;
`;
