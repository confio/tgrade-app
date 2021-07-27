import { Table } from "antd";
import styled from "styled-components";

export default styled(Table)`
  & .anticon.anticon-caret-up.ant-table-column-sorter-up.active,
  & .anticon.anticon-caret-down.ant-table-column-sorter-down.active {
    color: var(--color-primary);
  }

  & .ant-typography-expand,
  & .ant-typography-expand:hover {
    color: var(--color-primary);
  }
`;
