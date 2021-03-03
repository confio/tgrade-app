import styled from "styled-components";

export const Amount = styled.div`
  span.ant-typography {
    font-size: var(--s2);
    font-family: var(--ff-iceland);

    & + span.ant-typography {
      font-size: var(--s1);
    }
  }
`;

export const FormAmount = styled.div`
  display: flex;
  align-items: baseline;

  .ant-form-item {
    flex-grow: 1;
  }

  span.ant-typography {
    margin-left: var(--s0);
    font-family: var(--ff-iceland);
    font-size: var(--s1);
  }
`;
