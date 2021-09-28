import { ReactComponent as LinkedinLogo } from "App/assets/icons/linkedin-icon.svg";
import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-logo.svg";
import { ReactComponent as TwitterLogo } from "App/assets/icons/twitter-icon.svg";
import { paths } from "App/paths";
import { Link } from "react-router-dom";
import {
  ContactForm,
  ContentWrapper,
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
  return (
    <div>
      <PageWrapper>
        <Header>
          <TgradeLogo style={{ marginLeft: "100px" }} />
          <LogoWrapper>
            <a href="https://twitter.com/TgradeFinance">
              <TwitterLogo />
            </a>
            <a href="https://www.linkedin.com/company/tgrade">
              <LinkedinLogo />
            </a>
          </LogoWrapper>
        </Header>
        <ContentWrapper>
          <span style={{ marginLeft: "2rem", maxWidth: "650px", minWidth: "300px" }}>
            <Text>
              <b>Try Tgrade</b> and see for yourself - the power of Blockchain is closer than you think.
            </Text>
          </span>
          <Link to={paths.dso.prefix}>
            <LinkButton>
              <TextSmall>
                Try the <b>Tgrade App</b>
              </TextSmall>
            </LinkButton>
          </Link>
          <a href="https://outlook.office365.com/owa/calendar/Tgrade@confio.gmbh/bookings/s/WgrBVH4R9Umi2xs9SHsWqw2">
            <LinkButton>
              <TextSmall>
                Book a <b>Demo of Tgrade</b>
              </TextSmall>
            </LinkButton>
          </a>
          <Link to="/doc">
            <LinkButton>
              <TextSmall>
                Read the <b>Documentation</b>
              </TextSmall>
            </LinkButton>
          </Link>
          <a href="https://tgrade.finance/">
            <LinkButton>
              <TextSmall>
                Learn more about <b>Tgrade</b>
              </TextSmall>
            </LinkButton>
          </a>
        </ContentWrapper>
      </PageWrapper>
      <Footer>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: "100px" }}>
          <TgradeLogo style={{ width: "94px", marginBottom: "16px" }} />
          <Paragraph>©2021 by Confio.gmbh</Paragraph>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginLeft: "100px",
            marginRight: "100px",
            marginTop: "46px",
          }}
        >
          <a href="https://tgrade.finance/impressum/">
            <Paragraph>Legal Information / Impressum</Paragraph>
          </a>
          <div style={{ width: "200px" }} />
          <a href="https://tgrade.finance/privacy-policy">
            <Paragraph>Privacy Policy</Paragraph>
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Paragraph>NEWSLETTER</Paragraph>
          <ContactForm>
            <Paragraph style={{ marginLeft: "13px", color: "#8692A6" }}>Enter your email address</Paragraph>
            <SubscribeButton>Subscribe</SubscribeButton>
          </ContactForm>
        </div>
      </Footer>
    </div>
  );
}
