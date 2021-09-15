import { paths } from "App/paths";
import * as React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSdk } from "service";
import ConnectWalletModal from "../ConnectWalletModal";
import * as Icon from "./icons";
import { Cell, LinkWrapper, Navbar, StyledText, StyledAddressTag } from "./style";

export const NavSidebar: React.FC = () => {
  const {
    sdkState: { address },
  } = useSdk();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Navbar>
      <LinkWrapper>
        <Icon.TgradeLogo />
        <Link to={paths.dso.prefix}>
          <Cell>
            <Icon.TrustedCircle />
            <StyledText>Trusted Circle</StyledText>
            <Icon.Join />
          </Cell>
        </Link>
        <Link to={paths.tmarket.tmarket.prefix}>
          <Cell>
            <Icon.Token />
            <StyledText>T-Market</StyledText>
            <Icon.Trade />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <Icon.Oversight />
            <StyledText>Oversight Community</StyledText>
            <Icon.Manage />
          </Cell>
        </Link>
        <Link to="/">
          <Cell>
            <Icon.Wiki />
            <StyledText>Wiki</StyledText>
            <Icon.Learn />
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
      <Link to="/" onClick={() => setModalOpen(true)} style={{ position: "fixed", top: "90%" }}>
        <Cell>
          {address ? (
            <StyledAddressTag
              address={address}
              noYou
              short
              style={{
                marginLeft: "16px",
                display: "flex",
                justifyContent: "center",
                width: "204px",
                height: "26px",
              }}
            />
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
