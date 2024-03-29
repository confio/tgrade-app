import { FormItem } from "formik-antd";
import styled from "styled-components";

export const UnitInputContainer = styled.div`
  display: flex;
  align-items: stretch;
`;

export const UnitWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 4.5rem;
  background-color: var(--color-input-label-bg);
  border: 1px solid var(--color-input-border);
  border-right: none;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
`;

export default styled(FormItem)`
  .ant-form-item-control-input-content > * + * {
    margin-top: var(--s-3);
  }

  & [id^="label-"] {
    color: var(--color-text-1ary);
  }

  & [aria-labelledby^="label-"] {
    height: 3.25rem;
    border: 1px solid var(--color-input-border);
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  & .unitless-input,
  & .unitless-input textarea {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  &.ant-form-item-has-error {
    & ${UnitWrapper} {
      background-color: var(--color-error-form);

      & span.ant-typography {
        color: white;
      }
    }
  }

  & [role="alert"] {
    color: var(--color-error-form);
  }
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;

  & > span.ant-typography + span.ant-typography,
  & > span.ant-typography + img[alt="Tooltip"] {
    margin-left: var(--s-4);
  }
`;
