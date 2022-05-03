import { Tooltip, Typography } from "antd";
import closeIcon from "App/assets/icons/cross-tab.svg";
import copyToClipboard from "clipboard-copy";
import { useError } from "service";

import copyIcon from "../../assets/icons/copy.svg";
import Stack from "../Stack/style";
import { BannerContents, StyledErrorBanner } from "./style";

const { Text } = Typography;

export default function ErrorBanner(): JSX.Element | null {
  const { error, clearError } = useError();
  if (!error) return null;
  const cutError = error.slice(0, 50);

  return (
    <StyledErrorBanner role="alert">
      <BannerContents>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Stack>
            <Text>Something went wrong :(</Text>
            <Tooltip trigger="click" title="Error message copied" overlayStyle={{ zIndex: 1103 }}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "var(--s-2)", cursor: "pointer" }}
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
          <img alt="Close button" src={closeIcon} onClick={clearError} />
        </div>
      </BannerContents>
    </StyledErrorBanner>
  );
}
