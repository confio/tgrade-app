import styled from "styled-components";
import Button from "App/components/Button";
import LandingBG from "App/assets/images/landing-page-background.png";

export const PageWrapper = styled.div`
  background: url(${LandingBG});
  background-size: cover;
  width: 100vw;
  height: 100vh;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 80px;
`;

export const LogoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 110px;
  margin-right: 100px;
`;

export const Footer = styled.div`
  display: flex;
  width: 100%;
  height: 132px;
  position: relative;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  background: #242730;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50%;
  margin-top: 5%;
  margin-right 5%;
`;

export const Text = styled.h2`
  font-family: Montserrat;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #fff;
`;

export const TextSmall = styled.h2`
  font-family: Montserrat;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #fff;
`;

export const LinkButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 650px;
  min-width: 300px;
  max-height: 74px;
  min-height: 30px;
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 106px;
  margin-top: 20px;
  cursor: pointer;
`;

export const ContactForm = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 333px;
  height: 42px;
  border: 1px solid #8692a6;
  box-sizing: border-box;
  border-radius: 6px 36px 36px 6px;
  margin-right: 100px;
`;

export const Paragraph = styled.p`
  font-family: Montserrat;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
  letter-spacing: 0em;
  text-align: left;
  color: #fff;
`;

export const SubscribeButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 36px;
  border-radius: 36px;
  margin-right: 1px;
  font-family: Quicksand;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: center;
`;

export const LinkWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 46px 100px 0 100px;
`;

export const CopyrightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 100px;
`;
