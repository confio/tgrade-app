import { Select } from "antd";
import styled from "styled-components";

export const StyledSelect = styled(Select)`
  &.ant-select .ant-select-selector {
    border-radius: 6px;
    border-color: var(--color-input-border);

    &:hover {
      border-color: var(--color-input-border);
    }
  }

  &.ant-select.ant-select-lg.ant-select-focused .ant-select-selector {
    border-color: var(--color-input-border);
    box-shadow: none;
  }

  & .ant-select-selection-item {
    color: var(--color-text-1ary);
  }
`;
