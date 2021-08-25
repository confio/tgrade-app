import { Select } from "antd";
import { Select as FormikSelect } from "formik-antd";
import { css, default as styled } from "styled-components";

const selectStyles = css`
  &.ant-select .ant-select-selector {
    border-radius: var(--border-radius);
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

export default styled(Select)`
  ${selectStyles}
`;

export const FormSelect = styled(FormikSelect)`
  ${selectStyles}
`;
