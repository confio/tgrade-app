import styled from "styled-components";

import Button from "../Button";

export default styled(Button)`
  padding: var(--s-2);
  background: none;
  border: 2px solid white;

  &:hover,
  &:focus {
    background: none;
    border: 2px solid white;
    outline: 1px solid white;

    & .ant-typography {
      text-decoration: underline;
    }
  }

  & img {
    margin: auto 0;

    width: 100%;
    height: 100%;
    max-width: 24px;
    max-height: 24px;
  }

  & div {
    margin: auto var(--s-2);
    align-items: flex-start;
  }

  & .ant-typography {
    color: white;
  }
`;
