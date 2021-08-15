import Styled from "styled-components";

export const PageWrapper = Styled.div`
display:flex;
flex-direction:column;
width:100%;
background-color: #FAFAFA;
`;

export const Title = Styled.h1`

left: 264px;
top: 30px;
font-family: Quicksand;
font-style: normal;
font-weight: 500;
font-size: 31px;
line-height: 39px;

color: #242730;`;

export const LinkText = Styled.a`


left: 264px;
top: 116px;
font-family: Quicksand;
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 20px;

color: #0BB0B1;
&:onHover{
    cursor:pointer;
}
`;

export const Text = Styled.p`


left: 264px;
top: 82px;

font-family: Quicksand;
font-style: normal;
font-weight: normal;
font-size: 16px;
line-height: 28px;



color: #242730;`;
