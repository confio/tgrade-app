import Center from "App/components/Center";
import styled from "styled-components";

export default styled(Center)`
  flex-grow: 1;
  padding: clamp(var(--s0), calc(2vw + var(--s0)), var(--s4));
  overflow: hidden;

  & > * + * {
    margin-top: clamp(var(--s-2), calc(2vw + var(--s-2)), var(--s2));
  }
`;

export interface StyledMainProps {
  readonly maxwidth?: string;
  readonly centered?: "false";
}

export const StyledMain = styled(Center)<StyledMainProps>`
  --max-width: ${(props) => props.maxwidth ?? "29rem"};
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: ${(props) => (props.centered === "false" ? "flex-start" : "center")};
`;
