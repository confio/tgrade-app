import { Link } from "react-router-dom";
import { paths } from "App/paths";
import { HTMLAttributes } from "react";
import { Navbar, Cell, LinkWrapper, StyledText } from "./style";
import { ReactComponent as TcIcon } from "./assets/tcIcon.svg";
import { ReactComponent as TokenIcon } from "./assets/tokenIcon.svg";
import { ReactComponent as WikiIcon } from "./assets/wikiIcon.svg";
import { ReactComponent as FeedbackIcon } from "./assets/feedbackIcon.svg";
import { ReactComponent as TgradeLogo } from "./assets/tgradelogo.svg";
import { ReactComponent as ConnectWalletIcon } from "./assets/connectwalletIcon.svg";

export function NavSidebar({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  return (
    <Navbar>
      <LinkWrapper>
        <TgradeLogo style={{ margin: "1.5rem" }} />
        <Link to="/">
          <Cell>
            <TcIcon />
            <StyledText>Trusted Circle</StyledText>
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <TokenIcon />
            <StyledText>Tokens</StyledText>
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <WikiIcon />
            <StyledText>Wiki</StyledText>
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <FeedbackIcon />
            <StyledText>Feedback</StyledText>
          </Cell>
        </Link>
      </LinkWrapper>
      <Link to="/">
        <Cell>
          <ConnectWalletIcon />
          <StyledText>Connect Wallet</StyledText>
        </Cell>
      </Link>
    </Navbar>
  );
}
