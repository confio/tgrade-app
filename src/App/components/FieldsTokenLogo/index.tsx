import darkCloseIcon from "App/assets/icons/cross-tab.svg";
import Field from "App/components/Field";
import { isValidUrl } from "utils/query";

import { StyledFieldsTokenLogo } from "./style";

interface FieldsTokenLogoProps {
  readonly logoUrlLabel: string;
  readonly logoUrl: string;
  readonly clearLogoUrl: () => void;
}

export default function FieldsTokenLogo({
  logoUrlLabel,
  logoUrl,
  clearLogoUrl,
}: FieldsTokenLogoProps): JSX.Element {
  return (
    <StyledFieldsTokenLogo>
      <Field label={logoUrlLabel} placeholder="Enter logo url" optional />
      {isValidUrl(logoUrl) ? (
        <>
          <img alt="Token logo" src={logoUrl} />
          <img alt="Remove logo" src={darkCloseIcon} onClick={() => clearLogoUrl()} />
        </>
      ) : null}
    </StyledFieldsTokenLogo>
  );
}
