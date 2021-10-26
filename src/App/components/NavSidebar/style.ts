import { Typography } from "antd";
import { Tag } from "antd";
import MenuBG from "App/assets/images/menu-background.jpg";
import Styled from "styled-components";

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
svg:first-child{
    width:1.5rem;
}
svg:last-child{
    height: 18px;
}
&:hover{
    background-color:rgba(220,220,220,0.10);
    border-left: 4px solid white;
}
`;

export const StyledText = Styled(Typography.Text)`
&.ant-typography {
    color: #fff;
    font-size:1rem;
  }
`;

export const StyledAddressTag = Styled(Tag)`
display: flex;
justify-content: center;
align-items:center;
border-radius: var(--border-radius);
width: 204px;
height: 26px;
margin-left: 16px;
font-family: Quicksand;
font-size: 13px;
font-style: normal;
font-weight: 400;
line-height: 16px;
letter-spacing: 0em;
text-align: left;
`;
