import styled from "styled-components";
import { Menu } from "antd";

interface StyledProps {
  isMobile?: boolean;
}
export const PageWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: 100vh;
`;

export const ContentWrapper = styled.div<StyledProps>`
  width: ${(props) => (props.isMobile ? "100vw" : "70%")};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-left: ${(props) => (props.isMobile ? "5px" : "245")};
  padding: ${(props) => (props.isMobile ? "5px" : "50")};

  & div {
    margin-bottom: 25px;
  }
`;
export const StyledMenuItem = styled(Menu.Item)`
  color: #fff;
  & .ant-menu-item-active {
    background-color: rgba(220, 220, 220, 0.1);
    color: #fff;
  }

  & a {
    color: #fff;
    :hover {
      color: #fff;
    }
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
  & .ant-menu-item-selected::after {
    border-color: #fff;
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
  & .ant-menu-submenu-title {
    color: #fff;
  }
  & .ant-menu-submenu-arrow {
    color: #fff !important;
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
  margin-bottom: 25px;
`;
export const Subtitle = styled.h2`
  font-family: Quicksand;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 20px;
`;
export const Text = styled.p`
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 26px;
  letter-spacing: 0em;
  text-align: left;
  margin-bottom: 10px;
`;
