import { ReactComponent as LinkedinLogo } from "App/assets/icons/linkedin-icon.svg";
import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-logo.svg";
import { ReactComponent as TwitterLogo } from "App/assets/icons/twitter-icon.svg";
import { paths } from "App/paths";
import { Link } from "react-router-dom";
import { gtagLandingAction } from "utils/analytics";
import { isMobile } from "react-device-detect";
import {
  ContactForm,
  ContentWrapper,
  CopyrightWrapper,
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
import { copyrightNote } from "config/constants";

export default function LandingPage(): JSX.Element | null {
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
          <a
            target="_blank"
            href="https://tgrade.finance/"
            onClick={() => gtagLandingAction("goto_tgrade_website")}
            rel="noreferrer"
          >
            <LinkButton isMobile={isMobile}>
              <TextSmall>
                Learn more about <b>Tgrade</b>
              </TextSmall>
            </LinkButton>
          </a>
        </ContentWrapper>
      </PageWrapper>
      <Footer isMobile={isMobile}>
        <CopyrightWrapper isMobile={isMobile}>
          <TgradeLogo style={{ width: "94px", marginBottom: "16px" }} />
          <Paragraph>{copyrightNote}</Paragraph>
        </CopyrightWrapper>
        <a href="https://tgrade.finance/impressum/">
          <Paragraph>Legal Information / Impressum</Paragraph>
        </a>
        <a href="https://tgrade.finance/privacy-policy">
          <Paragraph>Privacy Policy</Paragraph>
        </a>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {isMobile ? null : (
            <div>
              {" "}
              <Paragraph>NEWSLETTER</Paragraph>
              <ContactForm>
                <Paragraph style={{ marginLeft: "13px", color: "#8692A6" }}>
                  Enter your email address
                </Paragraph>
                <SubscribeButton>Subscribe</SubscribeButton>
              </ContactForm>
            </div>
          )}
        </div>
      </Footer>
    </div>
  );
}
