import { notification } from "antd";
import { ReactComponent as LinkedinLogo } from "App/assets/icons/linkedin-icon.svg";
import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-logo.svg";
import { ReactComponent as TwitterLogo } from "App/assets/icons/twitter-icon.svg";
import { paths } from "App/paths";
import axios from "axios";
import { copyrightNote, hubspotFormGuid, hubspotPortalId, hubspotURL } from "config/constants";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import { gtagLandingAction } from "utils/analytics";

import {
  ContactForm,
  ContentWrapper,
  CopyrightWrapper,
  EmailInput,
  Footer,
  Header,
  LinkButton,
  LogoWrapper,
  PageWrapper,
  Paragraph,
  SubscribeButton,
  Text,
  TextSmall,
} from "./style";

export default function LandingPage(): JSX.Element | null {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!email) return;
    const formResponse = await submitForm(email);
    if (formResponse.status === 200) {
      notification.open({
        message: "Succesfully Subscribed",
        description: "Thanks. Please check your inbox",
      });
      setEmail("");
    } else {
      notification.open({
        message: "Something went wrong.",
        description: "Something went wrong. Please try again",
      });
    }
  };

  const submitForm = async (email: string) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      `${hubspotURL}${hubspotPortalId}/${hubspotFormGuid}`,
      {
        hubspotPortalId,
        hubspotFormGuid,
        fields: [
          { name: "email", value: email },
          { name: "tgrade_general", value: true },
        ],
      },
      config,
    );
    return response;
  };

  return (
    <div>
      <PageWrapper isMobile={isMobile}>
        <Header>
          <TgradeLogo style={{ marginLeft: isMobile ? "10px" : "100px", height: "30px" }} />
          <LogoWrapper isMobile={isMobile}>
            <a href="https://twitter.com/TgradeFinance">
              <TwitterLogo />
            </a>
            <a href="https://www.linkedin.com/company/tgrade">
              <LinkedinLogo />
            </a>
          </LogoWrapper>
        </Header>
        <ContentWrapper isMobile={isMobile}>
          <span
            style={{
              marginLeft: isMobile ? "0.5rem" : "2rem",
              maxWidth: isMobile ? "90vw" : "650px",
              minWidth: "300px",
            }}
          >
            <Text isMobile={isMobile}>
              <b>Try Tgrade</b> and see for yourself - the power of Blockchain is closer than you think.
            </Text>
          </span>
          <Link to={paths.dso.prefix} onClick={() => gtagLandingAction("open_app")}>
            <LinkButton isMobile={isMobile}>
              <TextSmall isMobile={isMobile}>
                Try the <b>Tgrade App</b>
              </TextSmall>
            </LinkButton>
          </Link>
          <a
            href="https://outlook.office365.com/owa/calendar/Tgrade@confio.gmbh/bookings/"
            onClick={() => gtagLandingAction("book_demo")}
          >
            <LinkButton isMobile={isMobile}>
              <TextSmall>
                Book a <b>Demo of Tgrade</b>
              </TextSmall>
            </LinkButton>
          </a>
          <Link
            target="_blank"
            to={paths.documentation.prefix}
            onClick={() => gtagLandingAction("open_docs")}
          >
            <LinkButton isMobile={isMobile}>
              <TextSmall>
                Read the <b>Documentation</b>
              </TextSmall>
            </LinkButton>
          </Link>
        </ContentWrapper>
      </PageWrapper>
      <Footer isMobile={isMobile}>
        <CopyrightWrapper isMobile={isMobile}>
          <TgradeLogo style={{ width: "94px", marginBottom: "16px" }} />
          <Paragraph>{copyrightNote}</Paragraph>
        </CopyrightWrapper>
        <Link target="_blank" to={paths.impressum.prefix}>
          <Paragraph>Impressum</Paragraph>
        </Link>
        <Link target="_blank" to={paths.privacypolicy.prefix}>
          <Paragraph>Privacy Policy</Paragraph>
        </Link>
        <Link target="_blank" to={paths.cookiepolicy.prefix}>
          <Paragraph>Cookie Policy</Paragraph>
        </Link>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {isMobile ? null : (
            <div>
              {" "}
              <Paragraph>NEWSLETTER</Paragraph>
              <ContactForm onSubmit={handleSubmit}>
                <EmailInput
                  name="email"
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></EmailInput>
                <SubscribeButton onClick={handleSubmit}>Subscribe</SubscribeButton>
              </ContactForm>
            </div>
          )}
        </div>
      </Footer>
    </div>
  );
}
