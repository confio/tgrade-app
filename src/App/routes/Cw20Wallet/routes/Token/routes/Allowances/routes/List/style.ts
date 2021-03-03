import { Button } from "antd";
import styled from "styled-components";

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
