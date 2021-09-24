import {
  Header,
  PageWrapper,
  LogoWrapper,
  Footer,
  ContentWrapper,
  Text,
  TextSmall,
  LinkButton,
} from "./style";
import { ReactComponent as TgradeLogo } from "App/assets/icons/tgrade-logo.svg";
import { ReactComponent as TwitterLogo } from "App/assets/icons/twitter-icon.svg";
import { ReactComponent as LinkedinLogo } from "App/assets/icons/linkedin-icon.svg";

export default function LandingPage(): JSX.Element | null {
  return (
    <PageWrapper>
      <Header>
        <TgradeLogo style={{ marginLeft: "100px" }} />
        <LogoWrapper>
          <TwitterLogo />
          <LinkedinLogo />
        </LogoWrapper>
      </Header>
      <ContentWrapper>
        <span style={{ marginLeft: "2rem", width: "650px" }}>
          <Text>
            <b>Try Tgrade</b> and see for yourself - the power of Blockchain is closer than you think.
          </Text>
        </span>
        <LinkButton>
          <TextSmall>
            Try the <b>Tgrade App</b>
          </TextSmall>
        </LinkButton>
        <LinkButton>
          <TextSmall>
            Book a <b>Demo of Tgrade</b>
          </TextSmall>
        </LinkButton>
        <LinkButton>
          <TextSmall>
            Read the <b>Documentation</b>
          </TextSmall>
        </LinkButton>
        <LinkButton>
          <TextSmall>
            Learn more about <b>Tgrade</b>
          </TextSmall>
        </LinkButton>
      </ContentWrapper>
      <Footer />
    </PageWrapper>
  );
}
