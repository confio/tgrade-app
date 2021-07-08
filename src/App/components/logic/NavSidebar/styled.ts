import Styled from "styled-components";
import MenuBG from "./assets/menubg.svg";

export const StyledNavbar = Styled.div`
display:flex;
flex-direction:column;
width:244px;
background-image: url(${MenuBG});
background-color:#047778;
`;

export const StyledCell = Styled.div`
display:flex;
align-items:center;
padding:20px;
width:240px;
height:78px;
color:#fff;
text.ant-typography {
     color:red;
  }

svg{
    margin:1rem;
}
&:hover{
    background-color:rgba(220,220,220,0.25);
    border-left: 2px solid white;
}
`;
