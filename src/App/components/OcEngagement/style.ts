import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const EngagementStack = styled(Stack)`
  padding: var(--s1);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;
  text-align: left;

  h2.ant-typography {
    font-size: var(--s0);
  }
`;

export const EgDataStack = styled(Stack)`
  & span.ant-typography {
    color: var(--color-text-2ary);
    font-weight: 500;
  }

  & > span.ant-typography:nth-child(1) {
    color: var(--color-text-1ary);
    font-size: var(--s-1);
  }
`;
