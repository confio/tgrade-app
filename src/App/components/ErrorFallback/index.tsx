import { Tooltip, Typography } from "antd";
import closeIcon from "App/assets/icons/cross-tab.svg";
import copyToClipboard from "clipboard-copy";
import { FallbackProps } from "react-error-boundary";
import { getErrorFromStackTrace } from "utils/errors";

import copyIcon from "../../assets/icons/copy.svg";
import Stack from "../Stack/style";
import { BannerContents, StyledErrorFallback } from "./style";

const { Text } = Typography;

export default function ErrorFallback({
  error: boundaryError,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
  const error = getErrorFromStackTrace(boundaryError);
  const cutError = error.slice(0, 50);

  return (
    <StyledErrorFallback role="alert">
      <BannerContents>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Stack>
            <Text>Something went wrong :(</Text>
            <Tooltip trigger="click" title="Error message copied" overlayStyle={{ zIndex: 1103 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10.24px", cursor: "pointer" }}
                onClick={() => copyToClipboard(error)}
              >
                <img alt="Copy icon" src={copyIcon} />
                <Text>
                  {cutError}
                  {cutError.length < error.length ? "…" : ""}
                </Text>
              </div>
            </Tooltip>
          </Stack>
          <img alt="Close button" src={closeIcon} onClick={resetErrorBoundary} />
        </div>
      </BannerContents>
    </StyledErrorFallback>
  );
}
