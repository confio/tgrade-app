import Button from "App/components/Button";

import BackButtonOrLink from "../BackButtonOrLink";
import { StyledModalButtons } from "./style";

/*
  TODO: add secondary button. That way this components serves as general controls for modals
 */

interface ModalButtonsProps {
  readonly buttonPrimary: {
    readonly text: string;
    readonly disabled: boolean;
    readonly onClick?: () => void;
  };
  readonly backButton?: {
    readonly text: string;
    readonly disabled: boolean;
    readonly onClick?: () => void;
  };
  readonly isLoading?: boolean;
}

export default function ModalButtons({
  buttonPrimary,
  backButton,
  isLoading,
}: ModalButtonsProps): JSX.Element {
  return (
    <StyledModalButtons>
      {backButton ? (
        <BackButtonOrLink
          text={backButton.text}
          disabled={backButton.disabled}
          onClick={backButton.onClick}
        />
      ) : null}
      <Button loading={isLoading} disabled={buttonPrimary.disabled} onClick={buttonPrimary.onClick}>
        <div>{buttonPrimary.text}</div>
      </Button>
    </StyledModalButtons>
  );
}
