import YourWalletContainer from "App/containers/YourWalletContainer";
import LiquidyContainer from "App/containers/LiquidyContainer";
import ExchangeContainer from "App/containers/ExchangeContainer";
import IssueTokensContainer from "App/containers/IssueTokensContainer";
import { PageWrapper, Title, LinkText, Text } from "./style";

export default function TMarketHome(): JSX.Element | null {
  return (
    <PageWrapper>
      <div style={{ width: "100%", margin: "5px" }}>
        <Title>Welcome to T-Market</Title>
        <Text>
          T-Market is an Automated Market Maker (AMM) which is constantly running and will always give a price
          for the listed pairs.
        </Text>
        <LinkText href="https://confio.github.io/tgrade-docs/docs/onboarding/T-Market/">
          What is T-market?
        </LinkText>
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <YourWalletContainer />
        <ExchangeContainer />
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <LiquidyContainer />
        <IssueTokensContainer />
      </div>
    </PageWrapper>
  );
}
