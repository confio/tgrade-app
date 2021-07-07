import Styled from "styled-components";

export const StyledNavbar = Styled.div`
display:flex;
flex-direction:column;
width:244px;
color:white;
background-color:#047778;
`;

export const StyledCell = Styled.div`
display:flex;
align-items:center;
padding:20px;
width:240px;
height:78px;
&:hover{
    background-color:rgba(220,220,220,0.25);
    border-left: 2px solid white;
}
`;
