import styled from "styled-components";

import { Stack } from "./index";

export default styled(Stack)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &&& > * {
    margin-top: 0;
    margin-bottom: 0;
  }

  &&& > * + * {
    margin-top: ${(props) => (props.gap ? `var(--${props.gap})` : "var(--s0)")};
  }
`;
