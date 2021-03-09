import { Alert } from "antd";
import styled from "styled-components";

export const StyledAlert = styled(Alert)`
  color: var(--color-error-alert);

  &.ant-alert-error {
    background: transparent;
    border: var(--border-width) solid currentColor;
    border-radius: var(--border-radius);

    img {
      width: 1.34rem;
      height: 1.34rem;
    }

    .ant-alert-message,
    .anticon-close {
      color: currentColor;
    }

    .ant-alert-message {
      margin-left: 0.5rem;
      text-align: left;
    }

    .ant-alert-close-icon {
      align-self: flex-start;
    }
  }
`;
