import styled from "styled-components";
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
  position: absolute;
  bottom: 0;
  width: 100vw;
  height: 132px;
  background: #242730;
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 50%;
  margin-top: 5%;
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
  width: 650px;
  height: 74px;
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 106px;
  margin-top: 20px;
  cursor: pointer;
`;
