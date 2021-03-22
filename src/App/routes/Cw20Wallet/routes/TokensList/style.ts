import { Form } from "antd";
import styled from "styled-components";

export const DoubleForm = styled(Form)`
  display: flex;

  & .ant-form-item {
    flex-basis: 50%;

    & + .ant-form-item {
      margin-left: var(--s0);
    }
  }
`;
