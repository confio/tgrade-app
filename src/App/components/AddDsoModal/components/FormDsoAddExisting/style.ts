import styled from "styled-components";

export const Separator = styled.hr`
  margin: 0 -20px 0 -20px;
  border: none;
  border-top: 1px solid var(--color-input-border);
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;

  & > span.ant-typography {
    margin-right: var(--s0);
  }

  & span.ant-typography > span.ant-typography {
    cursor: pointer;
    color: var(--color-primary);
    font-weight: 500;
    text-decoration: underline;
  }
`;
