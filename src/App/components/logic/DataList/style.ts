import { Divider } from "antd";
import styled from "styled-components";

export const DataDivider = styled(Divider)`
  border-color: var(--color-primary);
`;

export const DataRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  & span.ant-typography {
    font-family: var(--ff-iceland);
    font-size: var(--s2);
    line-height: var(--s2);

    & + span.ant-typography {
      font-family: var(--ff-montserrat);
      font-weight: bolder;
      font-size: var(--s-1);
      line-height: var(--s-1);
    }
  }
`;
