import { FormItem, Input } from "formik-antd";
import styled from "styled-components";

export const StyledFormItem = styled(FormItem)`
  & [id^="label-"] {
    color: var(--color-text-1ary);

    & + * {
      margin-top: var(--s-3);
    }
  }

  & [aria-labelledby^="label-"] {
    height: 3.25rem;
    border: 1px solid var(--color-input-border);
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  & .unit-input-container {
    display: flex;
    align-items: stretch;
  }

  & .unit-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 4.5rem;
    background-color: var(--color-input-label-bg);
    border: 1px solid var(--color-input-border);
    border-right: none;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  &.ant-form-item-has-error {
    & .unit-wrapper {
      background-color: var(--color-error-form);

      & span.ant-typography {
        color: white;
      }
    }
  }
`;

export const UnitlessInput = styled(Input)`
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
`;
