import styled from "styled-components";

export const FormField = styled.div`
  display: flex;
  align-items: baseline;

  & span.ant-typography {
    font-family: var(--ff-iceland);
    font-size: var(--s2);

    flex-basis: 30%;
    flex-shrink: 0;
    text-align: left;
  }

  & .ant-form-item {
    flex-basis: 70%;

    & + span.ant-typography {
      margin-left: var(--s-1);
      flex-basis: auto;
    }
  }
`;
