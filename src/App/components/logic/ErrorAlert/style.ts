import { Alert } from "antd";
import styled from "styled-components";

export const StyledAlert = styled(Alert)`
  &.ant-alert-error {
    background: transparent;
    border: 1px solid var(--color-red);

    .ant-alert-message,
    .anticon-close {
      color: var(--color-red);
    }
  }
`;
