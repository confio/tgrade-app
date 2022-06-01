import AddressTag from "App/components/AddressTag";
import { ValidatorUnjail } from "utils/trustedCircle";

import { TextLabel } from "../style";

interface ProposalUnjailValidatorProps {
  readonly proposalUnjailValidator: ValidatorUnjail | undefined;
}

export default function ProposalUnjailValidator({
  proposalUnjailValidator,
}: ProposalUnjailValidatorProps): JSX.Element | null {
  if (!proposalUnjailValidator) return null;

  return (
    <>
      <TextLabel>
        Validator To be Unjailed: <AddressTag address={proposalUnjailValidator.member} />
      </TextLabel>
    </>
  );
}
