import { Spin } from "antd";
import styled from "styled-components";

export const StyledSpin = styled(Spin)`
  color: var(--color-primary);

  & .anticon-loading {
    font-size: 6.25rem;
  }

  & .ant-spin-text {
    margin-top: var(--s2);
    font-family: var(--ff-text);
    font-size: var(--s0);
  }
`;
