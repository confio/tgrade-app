import Table from "antd/lib/table/Table";
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

  & :not(.ant-pagination-disabled) > .ant-pagination-item-link:hover {
    border-color: var(--color-primary);
  }

  & .ant-pagination-item-active,
  & .ant-pagination-item:hover {
    border-color: var(--color-primary);

    & a {
      color: var(--color-primary);
    }
  }

  & .ant-pagination-options-size-changer:hover {
    & .ant-select-selector {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    & .ant-select-arrow {
      color: var(--color-primary);
    }
  }
`;
