import { Typography } from "antd";
import { pathAccount, pathLogout, pathWallet } from "App/paths";
import { Link } from "react-router-dom";
import MenuCloser from "./MenuCloser";
import closeMenuIcon from "./assets/closeMenuIcon.svg";
import { MenuStack, StyledMenu } from "./style";

const { Title } = Typography;

interface MenuProps {
  readonly open: boolean;
  readonly setOpen: (open: boolean) => void;
}

export default function Menu({ open, setOpen }: MenuProps): JSX.Element {
  return (
    <>
      <MenuCloser open={open} setOpen={setOpen} />
      <StyledMenu open={open} setOpen={setOpen}>
        <MenuStack>
          <img
            alt="Close menu icon"
            src={closeMenuIcon}
            onClick={() => {
              setOpen(false);
            }}
          />
          <Link to={pathAccount}>
            <Title level={3}>Account</Title>
          </Link>
          <Link to={pathWallet}>
            <Title level={3}>Wallet</Title>
          </Link>
          <Link to={pathLogout}>
            <Title level={3}>Logout</Title>
          </Link>
        </MenuStack>
      </StyledMenu>
    </>
  );
}
