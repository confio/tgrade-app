import { Card } from "antd";
import { Form } from "formik-antd";
import styled from "styled-components";

export const CardCustom = styled(Card)`
  &.ant-card {
    width: 738px;
    min-height: 501px;
    border-radius: calc(var(--border-radius) + 10px);
    .ant-card-body {
      border-radius: calc(var(--border-radius) + 10px);
      padding: var(--s1);
      background: var(--bg-body);
    }
  }
`;

export const FormCustom = styled(Form)`
  display: grid;
  row-gap: calc(var(--s4) - var(--s3));
`;
