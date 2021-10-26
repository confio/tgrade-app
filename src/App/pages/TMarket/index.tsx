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

  return (
    <PageLayout maxwidth="738px" centered="false">
      <Stack gap="s4">
        <TitleWrapper>
          <Title>Welcome to T-Market</Title>
          <LightButton onClick={() => setModalOpen(true)}>Create Asset</LightButton>
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
