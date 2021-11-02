import darkCloseIcon from "App/assets/icons/cross-tab.svg";
import uploadIcon from "App/assets/icons/upload.svg";
import Field from "App/components/Field";
import { Input } from "formik-antd";
import { useState } from "react";
import { EmbeddedLogoType } from "utils/cw20";
import { isValidUrl } from "utils/query";
import { fileToBase64, getFileImgType } from "utils/storage";

import { StyledFieldsTokenLogo, UploadLabel } from "./style";

interface FieldsTokenLogoProps {
  readonly logoUrlLabel: string;
  readonly logoFileLabel: string;
  readonly setLogoUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  readonly setLogoFile: React.Dispatch<React.SetStateAction<EmbeddedLogoType | undefined>>;
  readonly setLogoError: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function FieldsTokenLogo({
  logoUrlLabel,
  logoFileLabel,
  setLogoUrl,
  setLogoFile,
  setLogoError,
}: FieldsTokenLogoProps): JSX.Element {
  const [previewLogoUrl, setPreviewLogoUrl] = useState("");

  return (
    <StyledFieldsTokenLogo>
      <Field
        label={logoUrlLabel}
        placeholder="Enter logo url"
        optional
        value={previewLogoUrl}
        onInputChange={({ target }) => {
          setPreviewLogoUrl(target.value);
          setLogoUrl(target.value);
        }}
      />
      <UploadLabel htmlFor="logo-upload">
        <img alt="" src={uploadIcon} />
        Upload Logo
      </UploadLabel>
      <Input
        id="logo-upload"
        name={logoFileLabel}
        type="file"
        accept=".svg, .png"
        style={{ display: "none" }}
        onChange={async ({ target }) => {
          if (!target.files?.length) return;
          const file = target.files[0];
          setLogoError(undefined);

          try {
            const logoUrl = URL.createObjectURL(file);
            setPreviewLogoUrl(logoUrl);
            const encodedFile = await fileToBase64(file);
            const imgType = await getFileImgType(file);
            const { length, [length - 1]: strippedEncoded } =
              imgType === "svg" ? encodedFile.split("/") : encodedFile.split(",");
            setLogoFile({ [imgType]: strippedEncoded });
          } catch (error) {
            setPreviewLogoUrl("");
            setLogoUrl(undefined);
            setLogoFile(undefined);
            if (!(error instanceof Error)) return;
            setLogoError(error.message);
          }
        }}
      />
      {isValidUrl(previewLogoUrl) ? (
        <>
          <img
            alt="Token logo"
            src={previewLogoUrl}
            onLoad={() => {
              URL.revokeObjectURL(previewLogoUrl);
              setLogoError(undefined);
            }}
            onError={(event: React.SyntheticEvent<HTMLImageElement, Event>) => {
              event.currentTarget.onerror = null;
              setLogoUrl(undefined);
              setLogoFile(undefined);
              setLogoError("Url must point to png or svg");
            }}
          />
          <img
            alt="Remove logo"
            src={darkCloseIcon}
            onClick={() => {
              setPreviewLogoUrl("");
              setLogoUrl(undefined);
              setLogoFile(undefined);
              setLogoError(undefined);
            }}
          />
        </>
      ) : null}
    </StyledFieldsTokenLogo>
  );
}
