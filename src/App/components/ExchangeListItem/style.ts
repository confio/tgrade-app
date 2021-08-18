import Styled from "styled-components";

export const ItemWrapper = Styled.div`
display:flex;
flex-direction:row;
align-items:center;
justify-content:space-between;
height:70px;
width:250px;
background: rgba(250, 250, 250, 0.6);

&:hover{
    cursor:pointer;
    box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.25);
}
`;
