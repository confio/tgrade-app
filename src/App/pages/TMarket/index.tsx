import "react-toastify/dist/ReactToastify.css";

import PageLayout from "App/components/PageLayout";
import Stack from "App/components/Stack/style";
import { lazy, useState } from "react";
import { ToastContainer } from "react-toastify";

import TMarket from "./routes";
import { LightButton, NotificationsContainer, Title, TitleWrapper } from "./style";

const IssueTokenModal = lazy(() => import("App/containers/IssueTokenModal"));

export default function TMarketHome(): JSX.Element | null {
  const [isModalOpen, setModalOpen] = useState(false);

  const isCbdc = window.location.href.includes("cbdc");
  const tMarketTitle = isCbdc ? "CBDC-Marketplace" : "T-Market";

  return (
    <PageLayout maxwidth="738px" centered="false">
      <Stack gap="s4">
        <TitleWrapper>
          <Title>Welcome to {tMarketTitle}</Title>
          <LightButton onClick={() => setModalOpen(true)} data-cy="t-market-page-create-asset-button">
            Create Asset
          </LightButton>
        </TitleWrapper>
        <NotificationsContainer id="notifications_container">
          <ToastContainer
            newestOnTop={true}
            position="bottom-right"
            hideProgressBar={true}
            autoClose={false}
          />
        </NotificationsContainer>
        <TMarket />
      </Stack>
      <IssueTokenModal isModalOpen={isModalOpen} closeModal={() => setModalOpen(false)} />
    </PageLayout>
  );
}
