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
    <div
      style={{ height: "125px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <TextLabel>
        Validator To be Unjailed: <b>{proposalUnjailValidator.member}</b>
      </TextLabel>

      <TextLabel>Comment:</TextLabel>
    </div>
  );
}
