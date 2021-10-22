import { InputNumber } from "formik-antd";
import styled from "styled-components";

export default styled(InputNumber)`
  width: 100%;
  padding: var(--s-6);
  border-radius: var(--border-radius);
  color: var(--color-button-2ary);
  .ant-input-number-input {
    font-size: 1rem;
    padding: 0 var(--s0);
    text-align: end;
    width: 100% !important;
  }
  .ant-input-number-handler-wrap {
    display: none;
  }

  &.ant-input-number:hover {
    color: var(--color-text-1ary);
  }

  &.ant-input-number:focus {
    border-color: var(--bg-button-1ary);
  }

  .ant-input-number-input:focus {
    color: var(--color-text-1ary);
  }
`;
