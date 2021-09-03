import Styled from "styled-components";

export const ItemWrapper = Styled.div`
display:flex;
flex-direction:row;
align-items:center;
justify-content:space-between;
height:70px;
width:325px;
background: #FFFFFF;
padding:8px;
font-size:10px;
&:hover{
    cursor:pointer;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
}
`;

export const AmountText = Styled.h1`
font-family: Quicksand;
font-size: 16px;
font-style: normal;
font-weight: 500;
line-height: 20px;
letter-spacing: 0em;
text-align: left;
margin-left:20px;

`;

export const SymbolText = Styled.h1`
font-family: Quicksand;
font-size: 13px;
font-style: normal;
font-weight: 700;
line-height: 16px;
letter-spacing: 0em;
text-align: left;
margin-left:5px;

`;

export const ValueText = Styled.h1`
font-family: Quicksand;
font-size: 13px;
font-style: normal;
font-weight: 500;
line-height: 16px;
letter-spacing: 0em;
text-align: left;
color: #8692A6;
`;
