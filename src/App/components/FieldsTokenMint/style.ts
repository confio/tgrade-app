import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const StyledFieldsTokenMint = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s0);
`;

export const MintStack = styled(Stack)`
  & span.ant-typography {
    font-size: var(--s0);
    color: var(--color-text-1ary);
  }

  & .ant-select {
    margin-top: var(--s-3);
    align-self: flex-start;
    width: 6.875rem;
    height: 52px;
    max-width: 22rem;
  }
`;
