import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const FormStack = styled(Stack)`
  & .ant-input-textarea {
    flex-basis: 100%;
  }

  & .ant-form-item-has-error .ant-input-textarea::after {
    color: var(--color-error-form);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  button:first-child {
    margin-right: var(--s0);
  }
`;
