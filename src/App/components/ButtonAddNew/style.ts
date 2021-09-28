import styled from "styled-components";

export default styled.div`
  cursor: pointer;
  display: flex;

  & img[alt="Add new"] {
    width: 1.25rem;
    height: 1.25rem;
  }

  & span.ant-typography {
    margin-left: var(--s-2);
    color: var(--color-primary);
    font-weight: 500;
  }
`;
