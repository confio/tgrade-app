import { Col, Row } from "antd";
import pageCover from "App/assets/images/modal-background.jpg";
import tgradeLogoTitle from "App/assets/tgrade-logo.svg";
import { HTMLAttributes } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationsContainer, StyledMarketLayout, TgradeLogo } from "./style";

export default function TMarketPageLayout({ children }: HTMLAttributes<HTMLOrSVGElement>): JSX.Element {
  return (
    <StyledMarketLayout tag="aside" gap="s2" background-image-url={pageCover}>
      <TgradeLogo className="tgrade-logo" src={tgradeLogoTitle} alt="Tgrade logo with title" />
      <NotificationsContainer id="notifications_container">
        <ToastContainer newestOnTop={true} position="top-center" />
      </NotificationsContainer>
      <Row style={{ width: "100%" }} justify="center">
        <Col>{children}</Col>
      </Row>
    </StyledMarketLayout>
  );
}
