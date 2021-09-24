import Stack from "App/components/Stack/style";
import IssueTokenModal from "App/containers/IssueTokenModal";
import { useState } from "react";
import TMarket from "./routes";
import { LightButton, LinkText, PageWrapper, Text, Title, TitleWrapper } from "./style";

export default function TMarketHome(): JSX.Element | null {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <PageWrapper>
      <Stack>
        <TitleWrapper>
          <Title>Welcome to T-Market</Title>
          <LightButton onClick={() => setModalOpen(true)}>Create Asset</LightButton>
        </TitleWrapper>
        <Text>
          T-Market is an Automated Market Maker (AMM) which is constantly running and will always give a price
          for the listed pairs.
        </Text>
        <LinkText href="https://confio.github.io/tgrade-docs/docs/onboarding/T-Market/">
          What is T-market?
        </LinkText>
        <TMarket />
      </Stack>
      <IssueTokenModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </PageWrapper>
  );
}
