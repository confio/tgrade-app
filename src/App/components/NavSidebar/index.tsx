import { paths } from "App/paths";
import { lazy, useState } from "react";
import { Link } from "react-router-dom";
import { useSdk } from "service";

import * as Icon from "./icons";
import {
  Cell,
  LinkWrapper,
  Navbar,
  StyledAddressTag,
  StyledCollapse,
  StyledPanel,
  StyledText,
  TextCell,
} from "./style";

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
              <StyledText>T-Market</StyledText>
              <Icon.Trade />
            </TextCell>
          </Cell>
        </Link>
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
              <StyledText>Engagement</StyledText>
              <Icon.TakeAway />
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
        <Link to="#" className="cky-banner-element">
          <Cell>
            <TextCell>
              <Icon.Feedback />
              <StyledText>Cookies</StyledText>
            </TextCell>
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
