import { Typography } from "antd";
import sadFaceIcon from "App/assets/icons/sad-face.svg";

import { StyledWarningBanner } from "./style";

const { Text } = Typography;

interface WarningBannerProps {
  readonly warning: string;
}

export default function WarningBanner({ warning }: WarningBannerProps): JSX.Element | null {
  return (
    <StyledWarningBanner role="alert">
      <div style={{ display: "flex", alignItems: "center", gap: "var(--s-2)" }}>
        <img alt="" src={sadFaceIcon} />
        <Text>{warning}</Text>
      </div>
    </StyledWarningBanner>
  );
}
