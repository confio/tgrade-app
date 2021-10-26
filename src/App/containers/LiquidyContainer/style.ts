import { Tabs } from "antd";
import styled from "styled-components";

export const LiquidityWrapper = styled.div`
  background-color: #ffffff;
  display: flex;
  width: 70%;
  margin: 5px;
  border-radius: 16px;
`;

export const StyledTabs = styled(Tabs)`
  &.ant-tabs {
    width: 100%;
  }

  & .ant-tabs-tab .ant-tabs-tab-btn {
    color: var(--color-text-1ary);
  }

  & .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    font-weight: 500;
  }

  & .ant-tabs-ink-bar {
    background-color: #0bb0b1;
    border-radius: 3px;
  }
`;
