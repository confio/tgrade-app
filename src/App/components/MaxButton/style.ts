import styled from "styled-components";
import Button from "App/components/Button";

export default styled(Button)`
  background: transparent;
  height: auto;
  border: var(--border-width) solid var(--bg-button-1ary);
  border-radius: calc(var(--border-radius) * 10);
  color: var(--bg-button-1ary);
  font-size: var(--s-1);
  &.ant-btn {
    padding: calc(var(--s-2) / 2) calc(var(--s-2) / 1.2);
  }
`;
