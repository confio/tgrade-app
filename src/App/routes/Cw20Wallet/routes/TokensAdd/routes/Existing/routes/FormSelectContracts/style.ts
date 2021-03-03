import { FormItem } from "formik-antd";
import styled from "styled-components";

export const TransferFormItem = styled(FormItem)`
  && .ant-form-item-control-input-content {
    &:hover {
      color: #43547d;
      border: 1px solid #43547d;
    }
  }

  & .ant-transfer {
    width: 100%;

    & > *:first-child {
      width: 100%;
    }

    & > *:not(:first-child) {
      display: none;
    }

    & .ant-transfer-list {
      height: auto;
      max-height: 300px;
    }

    & .ant-transfer-list-content-item-text {
      text-align: left;
    }
  }
`;
