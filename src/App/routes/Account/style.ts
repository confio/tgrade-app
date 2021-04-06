import { Button } from "antd";
import styled from "styled-components";

export const CopyAddressButton = styled(Button)`
  &.ant-btn-default {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: white;

    &:hover {
      color: var(--color-hover);
    }

    & span.ant-typography {
      color: currentColor;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & img {
      display: inline;
      color: currentColor;
    }
  }
`;
