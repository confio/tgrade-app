import Stack from "App/components/Stack/style";
import styled from "styled-components";

export const MembersStack = styled(Stack)`
  padding: var(--s1);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;
  text-align: left;

  h2.ant-typography {
    font-size: var(--s1);
  }
`;

export const MemberCounts = styled.div`
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  gap: var(--s0);
`;

export const MemberCount = styled.div`
  padding: var(--s1);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-basis: 14rem;
  min-height: 10rem;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);

  &:first-child span.ant-typography:first-child {
    color: var(--color-primary);
  }

  span.ant-typography:first-child {
    font-size: var(--s5);
    font-weight: 500;
  }

  span.ant-typography:nth-child(2) {
    color: var(--color-text-1ary);
  }
`;
