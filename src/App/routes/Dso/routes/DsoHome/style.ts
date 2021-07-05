import { Tabs } from "antd";
import styled from "styled-components";

export const StyledTabs = styled(Tabs)`
  &.ant-tabs {
    width: 100%;
  }

  & .ant-tabs-tab .ant-tabs-tab-btn {
    color: var(--color-text-1ary);
  }

  & .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: var(--color-text-1ary);
    font-weight: 500;
  }

  & .ant-tabs-ink-bar {
    background-color: var(--color-text-1ary);
  }
`;
