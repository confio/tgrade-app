import styled from "styled-components";

export const Amount = styled.div`
  & span.ant-typography {
    font-family: var(--ff-iceland);
    font-size: var(--s2);
    font-weight: bolder;
    overflow-wrap: anywhere;

    & + span.ant-typography {
      font-size: var(--s1);
    }
  }
`;
