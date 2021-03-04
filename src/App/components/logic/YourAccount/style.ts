import { Divider } from "antd";
import styled from "styled-components";

export const DataDivider = styled(Divider)`
  border-color: var(--color-primary);
`;

export const Balance = styled.div`
  & span.ant-typography {
    display: block;
    font-size: var(--s-1);

    & + span.ant-typography {
      font-weight: bold;
    }
  }
`;
