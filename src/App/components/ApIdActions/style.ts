import styled from "styled-components";

export const StyledApIdActions = styled.div`
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: white;

  h1.ant-typography {
    font-size: var(--s1);
  }

  img[alt="Actions button"] {
    height: 20px;
  }

  header {
    padding: var(--s1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  & .address-actions-container {
    display: flex;

    & > * {
      margin: 0;
    }

    & > * + * {
      margin-left: var(--s1);
    }
  }
`;

export const VotingRules = styled.div`
  display: flex;
  flex-direction: row;

  & span.ant-typography {
    padding: var(--s-1) var(--s1);
    color: var(--color-text-1ary);
    font-size: 13px;

    &:first-child {
      padding-right: 0;
      font-weight: 600;
    }
  }
`;

export const Separator = styled.hr`
  margin: 0;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const VSeparator = styled.div`
  border: none;
  border-left: 1px solid var(--color-input-border);
`;
