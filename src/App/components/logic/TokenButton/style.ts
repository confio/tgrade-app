import styled from "styled-components";

export const TokenItem = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  & span.ant-typography {
    color: currentColor;
    font-family: var(--ff-iceland);
    font-size: var(--s2);

    & + span.ant-typography {
      font-family: var(--ff-montserrat);
      font-size: var(--s-1);
      font-weight: bolder;
    }
  }
`;
