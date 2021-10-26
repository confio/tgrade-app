import { paths } from "App/paths";
import { lazy, useState } from "react";
import { Link } from "react-router-dom";
import { useSdk } from "service";

import * as Icon from "./icons";
import { Cell, LinkWrapper, Navbar, StyledAddressTag, StyledText } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));

export const NavSidebar: React.FC = () => {
  const {
    sdkState: { address },
  } = useSdk();
  const [isModalOpen, setModalOpen] = useState(false);

  function ellipsifyAddress(str: string): string {
    return str.length > 26 ? `${str.slice(0, 13)}…${str.slice(-13)}` : str;
  }
  return (
    <Navbar>
      <LinkWrapper>
        <Icon.TgradeLogo />
        <Link to={paths.dso.prefix}>
          <Cell>
            <Icon.TrustedCircle />
            <StyledText>Trusted Circles</StyledText>
            <Icon.Join />
          </Cell>
        </Link>
        <Link to={paths.tmarket.prefix}>
          <Cell>
            <Icon.Token />
            <StyledText>T-Market</StyledText>
            <Icon.Trade />
          </Cell>
        </Link>
        <Link to={paths.documentation.prefix} target="_blank" rel="noopener noreferrer">
          <Cell>
            <Icon.CodeIcon />
            <StyledText>Documentation</StyledText>
            <Icon.ArrowTopRight style={{ height: "10px" }} />
            <Icon.Code />
          </Cell>
        </Link>
        {/* <Link to="#">
          <Cell>
            <Icon.Oversight />
            <div style={{ flexDirection: "column" }}>
              <StyledText>Oversight Community</StyledText>
              <Icon.Manage style={{ marginLeft: "0px" }} />
            </div>
          </Cell>
        </Link>
        <Link to="#">
          <Cell>
            <Icon.Wiki />
            <StyledText>Knowledge base</StyledText>
            <Icon.Learn />
          </Cell>
        </Link>
        <Link to="#">
          <Cell>
            <Icon.Feedback />
            <StyledText>Feedback</StyledText>
            <Icon.Visit />
          </Cell>
        </Link> */}
      </LinkWrapper>
      <Link to="#" onClick={() => setModalOpen(true)} style={{ position: "fixed", top: "90%" }}>
        <Cell>
          {address ? (
            <StyledAddressTag>{ellipsifyAddress(address)}</StyledAddressTag>
          ) : (
            <>
              <Icon.ConnectWallet />
              <StyledText>Connect Wallet</StyledText>
            </>
          )}
        </Cell>
      </Link>
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </Navbar>
  );
};
