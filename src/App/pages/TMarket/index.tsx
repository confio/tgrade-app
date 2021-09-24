import Stack from "App/components/Stack/style";
import IssueTokenModal from "App/containers/IssueTokenModal";
import { useState } from "react";
import TMarket from "./routes";
import { LightButton, PageWrapper, Title, TitleWrapper } from "./style";

export default function TMarketHome(): JSX.Element | null {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <PageWrapper>
      <Stack gap="s4">
        <TitleWrapper>
          <Title>Welcome to T-Market</Title>
          <LightButton onClick={() => setModalOpen(true)}>Create Asset</LightButton>
        </TitleWrapper>
        <TMarket />
      </Stack>
      <IssueTokenModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </PageWrapper>
  );
}
