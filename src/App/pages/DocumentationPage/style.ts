import styled from "styled-components";
import { Menu } from "antd";

export const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export const ContentWrapper = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: 245px;
  padding: 50px;
`;
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

export const Title = styled.h1`
  font-family: Quicksand;
  font-size: 31px;
  font-style: normal;
  font-weight: 500;
  line-height: 39px;
  letter-spacing: 0em;
  text-align: left;
`;
export const Subtitle = styled.h2`
  font-family: Quicksand;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
`;
export const Text = styled.p`
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
`;

export const Code = styled.p`
  font-family: Space Mono;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0em;
  text-align: left;
`;
