import { Link } from "react-router-dom";
import { Navbar, Cell, LinkWrapper, StyledText } from "./style";
import * as Icon from "./icons";

export const NavSidebar: React.FC = () => {
  return (
    <Navbar>
      <LinkWrapper>
        <Icon.TgradeLogo />
        <Link to="/">
          <Cell>
            <Icon.TrustedCircle />
            <StyledText>Trusted Circle</StyledText>
            <Icon.Join />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <Icon.Token />
            <StyledText>T-Market</StyledText>
            <Icon.Trade />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <Icon.Wiki />
            <StyledText>Wiki</StyledText>
            <Icon.Visit />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <Icon.Feedback />
            <StyledText>Feedback</StyledText>
            <Icon.Visit />
          </Cell>
        </Link>
      </LinkWrapper>
      <Link to="/">
        <Cell>
          <Icon.ConnectWallet />
          <StyledText>Connect Wallet</StyledText>
        </Cell>
      </Link>
    </Navbar>
  );
};
