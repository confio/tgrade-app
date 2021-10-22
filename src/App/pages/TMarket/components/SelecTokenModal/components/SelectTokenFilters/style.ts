import { Radio } from "antd";
import styled from "styled-components";

export const StyledRadioGroup = styled(Radio.Group)`
  & .ant-radio:hover {
    border-color: var(--color-primary);
  }

  & .ant-radio-checked .ant-radio-inner {
    border-color: var(--color-primary);

    &:after {
      background-color: var(--color-primary);
    }
  }
`;
