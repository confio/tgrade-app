import Button from "App/components/Button";
import styled from "styled-components";

export default styled(Button)`
  border: var(--border-width) solid var(--bg-button-1ary);
  border-radius: calc(var(--border-radius) * 10);
  color: white;
  font-size: var(--s-1);
  &.ant-btn {
    padding: calc(var(--s-2) / 2) calc(var(--s-2) / 1.2);
  }

  &:hover,
  &:focus,
  &:hover:focus {
    & span {
      text-decoration: underline;
    }
  }
`;
