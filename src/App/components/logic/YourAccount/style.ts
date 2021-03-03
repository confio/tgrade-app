import { Divider } from "antd";
import styled from "styled-components";

export const DataDivider = styled(Divider)`
  border-color: #7c95ff;
`;

export const Balance = styled.div`
  & span.ant-typography {
    font-size: var(--s-1);

    & + span.ant-typography {
      font-weight: bold;
    }
  }
`;
