import { Col, Divider, Row, Typography } from "antd";
import Button from "App/components/Button";
import styled from "styled-components";

export const Container = styled(Col)`
  min-width: 340px;
`;

export const ImageContainer = styled(Row)`
  margin-bottom: var(--s1);
  justify-content: center;
`;

export const TitleContainer = styled(Row)`
  margin-bottom: var(--s6);
  justify-content: center;

  & h1.ant-typography {
    color: var(--color-primary);
  }
`;

export const HorizontalDivider = styled(Divider)`
  margin: var(--s0) 0;
  opacity: 0.5;

  &.ant-divider {
    border-top: 1px solid var(--color-primary);
  }
`;

export const RowContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;

  & + & {
    margin-top: var(--s-2);
  }
`;

export const Paragraph = styled(Typography.Paragraph)`
  &.ant-typography {
    color: var(--color-primary);
    font-size: var(--s-1);
  }
`;

export const OkButton = styled(Button)`
  width: 340px;
  margin: var(--s4) auto;
  border-radius: 50px;
  display: flex;
  justify-content: center;
`;
