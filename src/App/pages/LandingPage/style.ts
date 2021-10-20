import styled from "styled-components";
import Button from "App/components/Button";
import LandingBG from "App/assets/images/landing-page-background.png";

interface StyledProps {
  isMobile?: boolean;
}

export const PageWrapper = styled.div<StyledProps>`
  background: url(${LandingBG});
  background-size: cover;
  width: 100vw;
  height: ${(props) => (props.isMobile ? "85vh" : "100vh")};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 80px;
`;

export const LogoWrapper = styled.div<StyledProps>`
  display: flex;
  justify-content: space-between;
  width: 110px;
  margin-right: ${(props) => (props.isMobile ? "5px" : "100px")};
`;

export const Footer = styled.div<StyledProps>`
  display: flex;
  flex-direction: ${(props) => (props.isMobile ? "column" : "row")};
  width: 100%;
  height: 132px;
  position: relative;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  background: #242730;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ContentWrapper = styled.div<StyledProps>`
  display: flex;
  flex-direction: column;
  margin-left: ${(props) => (props.isMobile ? "1rem" : "50%")};
  margin-top: 5%;
  margin-right 5%;
`;

export const Text = styled.h2<StyledProps>`
  font-family: Montserrat;
  font-size: ${(props) => (props.isMobile ? "1rem" : "30px")};
  font-style: normal;
  font-weight: 400;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #fff;
`;

export const TextSmall = styled.h2<StyledProps>`
  font-family: Montserrat;
  font-size: ${(props) => (props.isMobile ? "0.75rem" : "20px")};
  font-style: normal;
  font-weight: 400;
  line-height: 50px;
  letter-spacing: 0em;
  text-align: left;
  color: #fff;
`;

export const LinkButton = styled.div<StyledProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: ${(props) => (props.isMobile ? "100%" : "650px")};
  min-width: ${(props) => (props.isMobile ? "100%" : "300px")};
  max-height: ${(props) => (props.isMobile ? "3rem" : "74px")};
  min-height: ${(props) => (props.isMobile ? "3rem" : "30px")};
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 106px;
  margin-top: ${(props) => (props.isMobile ? "1rem" : "20px")};
  cursor: pointer;
`;

export const EmailInput = styled.input`
  width: 100%;
  background: #242730;
  border: none;
  color: white;
  padding-left: 15px;
  &:focus {
    outline: none;
  }
`;
export const ContactForm = styled.form`
  display: flex;
  flex-direction: row;
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

export const CopyrightWrapper = styled.div<StyledProps>`
  display: flex;
  width: ${(props) => (props.isMobile ? "100vw" : "")};
  flex-direction: ${(props) => (props.isMobile ? "row" : "column")};
  justify-content: ${(props) => (props.isMobile ? "space-between" : "")};
  margin-left: ${(props) => (props.isMobile ? "" : "100px")};
  padding: ${(props) => (props.isMobile ? "5px" : "")};
`;
