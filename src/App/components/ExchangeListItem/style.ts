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
