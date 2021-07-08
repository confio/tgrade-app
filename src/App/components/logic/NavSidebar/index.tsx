import { Typography } from "antd";
import { NavLink } from "react-router-dom";
import { StyledNavbar, StyledCell } from "./styled";
import { ReactComponent as TcIcon } from "./assets/tcIcon.svg";
import { ReactComponent as TokenIcon } from "./assets/tokenIcon.svg";
import { ReactComponent as WikiIcon } from "./assets/wikiIcon.svg";
import { ReactComponent as FeedbackIcon } from "./assets/feedbackIcon.svg";
import { ReactComponent as TgradeLogo } from "./assets/tgradelogo.svg";
import { ReactComponent as ConnectWalletIcon } from "./assets/connectwalletIcon.svg";

export const NavSidebar: React.FC = () => {
  return (
    <StyledNavbar>
      <TgradeLogo />
      <NavLink exact to="/hannu">
        <StyledCell>
          <TcIcon />
          <Typography.Text>Trusted Circle</Typography.Text>
        </StyledCell>
      </NavLink>
      <StyledCell>
        <TokenIcon />
        <Typography.Text>Tokens</Typography.Text>
      </StyledCell>
      <StyledCell>
        <WikiIcon />
        <Typography.Text>Wiki</Typography.Text>
      </StyledCell>
      <StyledCell>
        <FeedbackIcon />
        <Typography.Text>Feedback</Typography.Text>
      </StyledCell>
      <StyledCell>
        <ConnectWalletIcon />
        <Typography.Text>Connect Wallet</Typography.Text>
      </StyledCell>
    </StyledNavbar>
  );
};
