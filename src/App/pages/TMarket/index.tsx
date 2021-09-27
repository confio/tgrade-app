import PageLayout from "App/components/PageLayout";
import Stack from "App/components/Stack/style";
import IssueTokenModal from "App/containers/IssueTokenModal";
import { paths } from "App/paths";
import { useState } from "react";
import { useLocation } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TMarket from "./routes";
import { LightButton, NotificationsContainer, Title, TitleWrapper } from "./style";

export default function TMarketHome(): JSX.Element | null {
  const { pathname } = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <PageLayout maxwidth="738px" centered="false">
      <Stack gap="s4">
        {!pathname.endsWith(paths.tmarket.exchange.result) ? (
          <TitleWrapper>
            <Title>Welcome to T-Market</Title>
            <LightButton onClick={() => setModalOpen(true)}>Create Asset</LightButton>
          </TitleWrapper>
        ) : null}
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
