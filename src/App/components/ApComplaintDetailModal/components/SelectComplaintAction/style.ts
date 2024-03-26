import Select from "App/components/Select";
import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const ComplaintActionStack = styled(Stack)`
  & span.ant-typography {
    font-size: var(--s0);
    color: var(--color-text-1ary);
  }

  & .ant-select {
    align-self: flex-start;
    width: 100%;
    max-width: 22rem;
  }
`;

export const StyledSelect = styled(Select)`
  .ant-select-arrow {
    color: #8692a6;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & .ant-form-item {
    flex-basis: 18rem;
  }
`;
