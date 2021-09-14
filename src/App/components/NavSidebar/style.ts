import { Typography } from "antd";
import Styled from "styled-components";
import MenuBG from "App/assets/images/menu-background.jpg";

export const Navbar = Styled.div`
display:flex;
justify-content:space-between;
flex-direction:column;
min-height: 100vh;
width:15.25rem;
background: linear-gradient(0deg, rgba(1, 100, 101, 0.97), rgba(1, 100, 101, 0.97)), url(${MenuBG});
svg{
    margin:1rem;
}
`;

export const LinkWrapper = Styled.div`
display:flex;
flex-direction:column;
`;
export const Cell = Styled.div`
display:flex;
align-items:center;
width:15.25rem;
height:4.875rem;
color:#fff;
border-left: 4px solid transparent;
svg{
    margin:0.5rem;
}
&:hover{
    background-color:rgba(220,220,220,0.10);
    border-left: 4px solid white;
}
`;

export const StyledText = Styled(Typography.Text)`
&.ant-typography {
    color: #fff;
    width:60%;
    font-size:14px;
  }
`;
