import { paths } from "App/paths";
import { useHistory, useLocation } from "react-router-dom";
import { Menu, StyledSoonIcon } from "./style";

const MenuAMM = (): JSX.Element => {
  const history = useHistory();
  const location = useLocation();
  const changeTab = (e: any): void => history.push(e.key);
  return (
    <Menu onClick={changeTab} selectedKeys={[location.pathname]} mode="horizontal">
      <Menu.Item key={`${paths.tmarket.prefix}${paths.tmarket.exchange.prefix}`}>Exchange</Menu.Item>
      <Menu.Item key={`${paths.tmarket.prefix}${paths.tmarket.provide.prefix}`}>Provide Liquidity</Menu.Item>
      <Menu.Item key={`${paths.tmarket.prefix}${paths.tmarket.withdraw.prefix}`}>Withdraw</Menu.Item>
      <Menu.Item disabled>
        Charts and statistics
        <StyledSoonIcon />
      </Menu.Item>
    </Menu>
  );
};

export default MenuAMM;
