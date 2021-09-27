import { Card, Row } from "antd";
import Button from "App/components/Button";
import Styled from "styled-components";

export const CardCustom = Styled(Card)`
  &.ant-card {
    width: 738px;
    min-height: 501px;
    border-radius: calc(var(--border-radius) + 10px);
    .ant-card-body {
      border-radius: calc(var(--border-radius) + 10px);
      padding: var(--s1);
      background: var(--bg-body);
    }
  }
`;

export const PageWrapper = Styled.div`
display:flex;
flex-direction:column;
width:100%;
max-width: 738px;
background-color: #FAFAFA;
margin: var(--s0) auto;
`;

export const TitleWrapper = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = Styled.h1`
left: 264px;
top: 30px;
font-family: Quicksand;
font-style: normal;
font-weight: 600;
font-size: 31px;
line-height: 39px;
color: #242730;`;

export const LightButton = Styled(Button)`
  align-items: center;
  height: 30px;
  color: var(--color-primary);
  background-color: white;
`;

export const NotificationsContainer = Styled(Row)`
  width: 100%;
  justify-content: center;
`;
