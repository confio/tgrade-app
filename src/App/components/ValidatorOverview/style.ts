import { Table } from "antd";
import styled from "styled-components";
export const StyledTable = styled(Table)`
  margin: 25px;
  .ant-table-column-title {
    position: relative;
    z-index: 1;
    flex: 1 1;
    font-family: Quicksand;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0em;
    text-align: left;
  }

  .ant-table-tbody > tr > td {
    font-family: Quicksand;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
  }
`;
