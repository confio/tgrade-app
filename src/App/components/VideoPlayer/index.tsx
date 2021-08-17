import * as React from "react";
import StyledVideoPlayer from "./style";

interface VideoPlayerProps {
  readonly url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps): JSX.Element {
  return <StyledVideoPlayer url={url} muted playing controls width="100%" height="100%" />;
}
