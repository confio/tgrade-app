import styled from "styled-components";
import { Menu } from "antd";

export const StyledMenuItem = styled(Menu.Item)`
  color: #fff;
  & .ant-menu-item-active {
    background-color: rgba(220, 220, 220, 0.1);
    color: #fff;
  }
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
`;
export const StyledItemGroup = styled(Menu.ItemGroup)`
  background-color: #054e4f;

  & .ant-menu-item-group-title {
    color: #fff;
  }
  & .ant-menu-item-active {
    background-color: rgba(220, 220, 220, 0.1);
    color: #fff;
  }
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
`;
export const StyledSubmenu = styled(Menu.SubMenu)`
  & .ant-menu-item-active {
    background-color: rgba(220, 220, 220, 0.1);
    color: #fff;
  }
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
`;
export const StyledMenu = styled(Menu)`
  height: 100vh;
  width: 244px;
  position: fixed;
  background-color: #016465;
  color: white;
  & .ant-menu-item-active {
    background-color: rgba(220, 220, 220, 0.1);
  }
  & .ant-menu-item-selected {
    background-color: rgba(220, 220, 220, 0.1) !important;
  }

  & .ant-menu-sub {
    background-color: #016465;
  }
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
`;
