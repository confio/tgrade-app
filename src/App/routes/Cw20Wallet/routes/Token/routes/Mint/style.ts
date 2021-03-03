import styled from "styled-components";

export const Amount = styled.div`
  & span.ant-typography {
    font-size: var(--s2);
    font-family: var(--ff-iceland);

    & + span.ant-typography {
      font-size: var(--s1);
    }
  }
`;
