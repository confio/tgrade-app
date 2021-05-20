import * as React from "react";
import { StyledReactPlayer } from "./style";

interface VideoPlayerProps {
  readonly url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps): JSX.Element {
  return <StyledReactPlayer url={url} muted playing controls width="100%" height="100%" />;
}
