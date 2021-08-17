import { Button } from "antd";
import styled from "styled-components";

export default styled(Button)`
  /* display = flex for loading spinner */
  display: flex;

  padding: var(--s0) var(--s1);

  height: auto;
  border: ${(props) =>
    props.danger
      ? `1px solid var(--bg-button-danger)`
      : props.type === "ghost"
      ? "1px solid var(--border-button-2ary)"
      : "1px solid var(--bg-button-1ary)"};
  border-radius: 36px;
  box-shadow: none;

  color: ${(props) => (props.type === "ghost" ? "var(--color-button-2ary)" : "white")};
  background-color: ${(props) =>
    props.danger
      ? `var(--bg-button-danger)`
      : props.type === "ghost"
      ? "var(--bg-button-2ary)"
      : "var(--bg-button-1ary)"};

  font-family: var(--ff-quicksand);
  font-size: var(--s0);
  font-weight: 500;
  line-height: var(--ratio);
  white-space: normal;

  &:hover,
  &:focus {
    color: ${(props) => (props.type === "ghost" ? "var(--color-button-2ary-selected)" : "white")};
    border: ${(props) =>
      props.danger
        ? `1px solid var(--bg-button-danger)`
        : props.type === "ghost"
        ? "1px solid var(--border-button-2ary-selected)"
        : "1px solid var(--bg-button-1ary)"};
    background-color: ${(props) =>
      props.danger
        ? `var(--bg-button-danger)`
        : props.type === "ghost"
        ? "var(--bg-button-2ary)"
        : "var(--bg-button-1ary)"};
  }
`;
