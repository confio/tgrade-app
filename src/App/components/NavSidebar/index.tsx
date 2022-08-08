import { paths } from "App/paths";
import { lazy, useState } from "react";
import { Link } from "react-router-dom";

import ButtonConnectWallet from "../ButtonConnectWallet";
import * as Icon from "./icons";
import { Cell, LinkWrapper, Navbar, StyledCollapse, StyledPanel, StyledText, TextCell } from "./style";

const ConnectWalletModal = lazy(() => import("App/components/ConnectWalletModal"));

export const NavSidebar: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const isCbdc = window.location.href.includes("cbdc");
  const tMarketTitle = isCbdc ? "CBDC-Marketplace" : "T-Market";

  return (
    <Navbar>
      <LinkWrapper>
        {isCbdc ? <Icon.CbdcLogo /> : <Icon.TgradeLogo />}
        <Link to={paths.dso.prefix}>
          <Cell>
            <Icon.TrustedCircle />
            <TextCell>
              <StyledText>Trusted Circles</StyledText>
              <Icon.Join />
            </TextCell>
          </Cell>
        </Link>
        <Link to={paths.tmarket.prefix}>
          <Cell>
            <Icon.Token />
            <TextCell>
              <StyledText>{tMarketTitle}</StyledText>
              <Icon.Trade />
            </TextCell>
          </Cell>
        </Link>
        {!isCbdc ? (
          <>
            <StyledCollapse ghost expandIconPosition="right">
              <StyledPanel
                key="1"
                header={
                  <Cell>
                    <Icon.Oversight />
                    <TextCell>
                      <StyledText>Governance</StyledText>
                      <Icon.Manage />
                    </TextCell>
                  </Cell>
                }
              >
                <Link to={paths.oc.prefix}>
                  <Cell>
                    <TextCell>
                      <StyledText>Oversight Community</StyledText>
                    </TextCell>
                  </Cell>
                </Link>
                <Link to={paths.validators.prefix}>
                  <Cell>
                    <TextCell>
                      <StyledText>Validators</StyledText>
                    </TextCell>
                  </Cell>
                </Link>
                <Link to={paths.cpool.prefix}>
                  <Cell>
                    <TextCell>
                      <StyledText>Community Pool</StyledText>
                    </TextCell>
                  </Cell>
                </Link>
              </StyledPanel>
            </StyledCollapse>
            <Link to={paths.engagement.prefix}>
              <Cell>
                <Icon.Flag />
                <TextCell>
                  <StyledText data-cy="main-nav-side-bar-engagement">Engagement</StyledText>
                  <Icon.TakeAway />
                </TextCell>
              </Cell>
            </Link>
            <Link to={paths.documentation.prefix} target="_blank" rel="noopener noreferrer">
              <Cell>
                <Icon.Wiki />
                <TextCell>
                  <div>
                    <StyledText>Documentation</StyledText>
                    <Icon.ArrowTopRight style={{ height: "10px" }} />
                  </div>
                  <Icon.Code />
                </TextCell>
              </Cell>
            </Link>
            <a
              href="https://confio.github.io/tgrade-address-generator/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <Cell>
                <Icon.CodeIcon />
                <TextCell>
                  <div>
                    <StyledText>Address Generator</StyledText>
                    <Icon.ArrowTopRight style={{ height: "10px" }} />
                  </div>
                </TextCell>
              </Cell>
            </a>
          </>
        ) : null}
        <Link to="#" className="cky-banner-element">
          <Cell>
            <TextCell>
              <Icon.Feedback />
              <StyledText>Cookies</StyledText>
            </TextCell>
          </Cell>
        </Link>
      </LinkWrapper>
      <ButtonConnectWallet onClick={() => setModalOpen(true)} />
      <ConnectWalletModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </Navbar>
  );
};
