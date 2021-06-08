import { Stack } from "App/components/layout";
import styled from "styled-components";

export const ProposalStack = styled(Stack)`
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

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const FieldGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & .ant-form-item {
    flex-basis: 18rem;
  }
`;
