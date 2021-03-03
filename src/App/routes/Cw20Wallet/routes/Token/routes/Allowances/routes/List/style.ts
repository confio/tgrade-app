import { Button } from "antd";
import styled from "styled-components";

export const Amount = styled.div`
  span.ant-typography {
    font-size: var(--s2);
    font-family: var(--ff-iceland);
  }

  span.ant-typography + span.ant-typography {
    font-size: var(--s1);
  }
`;

export const AllowanceButton = styled(Button)`
  display: flex;
  align-items: center;

  & span {
    text-overflow: ellipsis;
    overflow: hidden;
    width: 100%;
    font-size: var(--s0);
  }
`;
