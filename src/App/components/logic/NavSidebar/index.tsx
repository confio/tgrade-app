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
import { ReactComponent as TradeIcon } from "./assets/trade.svg";
import { ReactComponent as JoinIcon } from "./assets/join.svg";
import { ReactComponent as LearnIcon } from "./assets/learn.svg";
import { ReactComponent as VisitIcon } from "./assets/visit.svg";

export function NavSidebar({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  return (
    <Navbar>
      <LinkWrapper>
        <TgradeLogo style={{ margin: "1.5rem" }} />
        <Link to="/">
          <Cell>
            <TcIcon />
            <StyledText>Trusted Circle</StyledText>
            <JoinIcon />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <TokenIcon />
            <StyledText>T-Market</StyledText>
            <TradeIcon />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <WikiIcon />
            <StyledText>Wiki</StyledText>
            <LearnIcon />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <FeedbackIcon />
            <StyledText>Feedback</StyledText>
            <VisitIcon />
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
