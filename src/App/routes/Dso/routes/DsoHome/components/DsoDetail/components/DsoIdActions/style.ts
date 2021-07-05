import styled from "styled-components";

export const StyledDsoIdActions = styled.div`
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
  justify-content: space-around;

  & span.ant-typography {
    padding: var(--s-1) var(--s1);
    color: var(--color-text-1ary);

    &:first-child {
      font-weight: 600;
    }
  }
`;

export const VSeparator = styled.div`
  border: none;
  border-left: 1px solid var(--color-input-border);
`;

export const ActionsButton = styled.img`
  cursor: pointer;
`;
