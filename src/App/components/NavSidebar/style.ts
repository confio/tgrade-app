import { Collapse, Typography } from "antd";
import Styled from "styled-components";

export const Navbar = Styled.div`
  display:flex;
  justify-content:space-between;
  flex-direction:column;
  min-height: 100vh;
  width:15.25rem;
  background: hsla(224, 15%, 14%, 1);

  & .ant-collapse-item-active {
    background: hsla(225, 15%, 16%, 1);
  }

  & svg{
    margin: 1rem;
    margin-left: calc(0.5rem + 4px); /* Cell's margin + border */
    margin-right: 2rem;
  }

  & button {
    margin: var(--s0);
    margin-top: var(--s0);
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
svg:first-child{
    margin: 0.5rem;
    width: 100%;
    height: auto;
    max-width: 1.5rem;
    max-height: 1.5rem;
}
&:hover{
    background-color:rgba(220,220,220,0.10);
    border-left: 4px solid white;
}
`;

export const TextCell = Styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  svg:last-child{
    margin: 0.3rem;
    margin-left: 0.5rem;
    height: 18px;
  }

  & > div > svg:last-child {
    margin: 0rem;
    margin-left: 0.5rem;
  }
`;

export const StyledText = Styled(Typography.Text)`
&.ant-typography {
    color: #fff;
    font-size:1rem;
  }
`;

export const StyledCollapse = Styled(Collapse)`
  & > .ant-collapse-item > .ant-collapse-header, .ant-collapse-content-box {
    padding: 0;
  }

  & .ant-collapse-header span[role="img"] {
    color: white;
  }
`;

export const StyledPanel = Styled(Collapse.Panel)`
  a ${StyledText} {
    margin-left: var(--s3);
  }
`;
