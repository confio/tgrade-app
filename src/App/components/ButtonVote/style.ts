import styled from "styled-components";

import Button from "../Button";

export default styled(Button)`
  background: var(--btn-vote-bg);
  display: flex;
  align-items: center;
  gap: var(--s-2);

  &&& {
    width: 130px;
    height: 52px;
  }

  &:hover,
  &:focus {
    background: var(--btn-vote-bg);
    opacity: 0.8;
  }

  & svg {
    color: white;
    height: 20px;
  }

  &:disabled svg,
  &:disabled span {
    color: var(--color-secondary);
  }
`;
