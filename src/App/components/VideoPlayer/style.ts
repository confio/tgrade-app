import styled from "styled-components";
import ReactPlayer from "react-player/lazy";

export default styled(ReactPlayer)`
  overflow: hidden;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25), inset 0px -2px 0px #0bb0b1;
  border-radius: var(--border-radius);
`;
