import styled from "styled-components";

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  & h1 {
    font-size: var(--s3);
    font-weight: 500;
    line-height: 2.35rem;
  }

  & img {
    cursor: pointer;
    height: 1.25rem;
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

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  button:first-child {
    margin-right: var(--s0);
  }
`;
