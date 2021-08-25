import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const StyledFieldsTokenSupply = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--s0);
`;

export const TokenLookStack = styled(Stack)`
  & span.ant-typography {
    font-size: var(--s0);
    color: var(--color-text-1ary);
  }
`;
