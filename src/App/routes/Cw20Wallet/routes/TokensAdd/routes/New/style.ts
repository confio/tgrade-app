import styled from "styled-components";

export const FormField = styled.div`
  display: flex;
  align-items: center;

  & > * + * {
    margin-left: var(--s0);
  }

  & span.ant-typography {
    font-family: var(--ff-iceland);
    font-size: var(--s2);
    flex-basis: 30%;
    flex-shrink: 0;
    word-wrap: break-word;
    text-align: left;
  }

  & .ant-form-item {
    flex-basis: 70%;
    flex-shrink: 1;
  }
`;
