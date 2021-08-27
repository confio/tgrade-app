import darkCloseIcon from "App/assets/icons/cross-tab.svg";
import uploadIcon from "App/assets/icons/upload.svg";
import Field from "App/components/Field";
import { Input } from "formik-antd";
import { useState } from "react";
import { isValidUrl } from "utils/query";
import { StyledFieldsTokenLogo, UploadLabel } from "./style";

interface FieldsTokenLogoProps {
  readonly logoUrlLabel: string;
  readonly logoFileLabel: string;
}

export default function FieldsTokenLogo({ logoUrlLabel, logoFileLabel }: FieldsTokenLogoProps): JSX.Element {
  const [logoUrl, setLogoUrl] = useState("");

  return (
    <StyledFieldsTokenLogo>
      <Field
        label={logoUrlLabel}
        placeholder="Enter logo url"
        value={logoUrl}
        onInputChange={({ target }) => setLogoUrl(target.value)}
      />
      <UploadLabel htmlFor="logo-upload">
        <img alt="" src={uploadIcon} />
        Upload Logo (SVG)
      </UploadLabel>
      <Input
        id="logo-upload"
        name={logoFileLabel}
        type="file"
        accept=".svg"
        style={{ display: "none" }}
        onChange={({ target }) => {
          if (!target.files?.length) return;
          const file = target.files[0];
          const logoUrl = URL.createObjectURL(file);
          setLogoUrl(logoUrl);
        }}
      />
      {isValidUrl(logoUrl) ? (
        <>
          <img alt="Token logo" src={logoUrl} onLoad={() => URL.revokeObjectURL(logoUrl)} />
          <img alt="Remove logo" src={darkCloseIcon} onClick={() => setLogoUrl("")} />
        </>
      ) : null}
    </StyledFieldsTokenLogo>
  );
}
