import Button from "App/components/Button";
import { StyledModalButtons } from "./style";

/*
  TODO: add secondary button and back button. That way this components serves as general controls for modals
 */

interface ModalButtonsProps {
  readonly buttonPrimaryTitle: string;
  readonly buttonPrimaryDisabled: boolean;
  readonly buttonPrimaryOnClick?: React.MouseEventHandler<HTMLElement>;
}

export default function ModalButtons({
  buttonPrimaryDisabled,
  buttonPrimaryOnClick,
  buttonPrimaryTitle,
}: ModalButtonsProps): JSX.Element {
  return (
    <StyledModalButtons>
      <Button disabled={buttonPrimaryDisabled} onClick={buttonPrimaryOnClick}>
        <div>{buttonPrimaryTitle}</div>
      </Button>
    </StyledModalButtons>
  );
}
