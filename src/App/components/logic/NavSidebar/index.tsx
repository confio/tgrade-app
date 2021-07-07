import { Typography } from "antd";
import { ReactComponent as TcIcon } from "./assets/tclogo.svg";
import { ReactComponent as TokenIcon } from "./assets/tokenlogo.svg";
import { ReactComponent as WikiIcon } from "./assets/wikilogo.svg";
import { ReactComponent as FeedbackIcon } from "./assets/feedbacklogo.svg";
import { ReactComponent as TgradeLogo } from "./assets/tgradelogo.svg";
import { ReactComponent as ConnectWalletIcon } from "./assets/connectwalletIcon.svg";
import { NavLink } from "react-router-dom";
import { StyledNavbar, StyledCell } from "./styled";

export const NavSidebar: React.FC = () => {
  return (
    <StyledNavbar>
      <TgradeLogo style={{ margin: "20px", marginBottom: "25px" }} />
      <NavLink exact to="/hannu">
        <StyledCell>
          <TcIcon style={{ marginRight: "10px" }} />
          <Typography.Text style={{ color: "white" }}>Trusted Circle</Typography.Text>
        </StyledCell>
      </NavLink>
      <StyledCell>
        <TokenIcon style={{ marginRight: "10px" }} />
        <Typography.Text style={{ color: "white" }}>Tokens</Typography.Text>
      </StyledCell>
      <StyledCell>
        <WikiIcon style={{ marginRight: "10px" }} />
        <Typography.Text style={{ color: "white" }}>Wiki</Typography.Text>
      </StyledCell>
      <StyledCell>
        <FeedbackIcon style={{ marginRight: "10px" }} />
        <Typography.Text style={{ color: "white" }}>Feedback</Typography.Text>
      </StyledCell>
      <StyledCell>
        <ConnectWalletIcon style={{ marginRight: "10px" }} />
        <Typography.Text style={{ color: "white" }}>Connect Wallet</Typography.Text>
      </StyledCell>
    </StyledNavbar>
  );
};
