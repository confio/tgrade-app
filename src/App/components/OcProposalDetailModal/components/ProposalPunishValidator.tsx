import { ValidatorPunishment } from "utils/dso";

import { TextLabel } from "../style";

interface ProposalPunishValidatorProps {
  readonly proposalPunishValidator: ValidatorPunishment | undefined;
}

export default function ProposalPunishValidator({
  proposalPunishValidator,
}: ProposalPunishValidatorProps): JSX.Element | null {
  let jailForever = false;
  if (proposalPunishValidator?.jailing_duration.duration === 0) {
    jailForever = true;
  }
  return proposalPunishValidator ? (
    <div
      style={{ height: "100px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <TextLabel>
        Validator To be Punished: <b>{proposalPunishValidator.member}</b>
      </TextLabel>
      <TextLabel>
        Jail Validator until:{" "}
        {jailForever ? (
          <b style={{ color: "red" }}>Forever</b>
        ) : (
          <b> {proposalPunishValidator.jailing_duration.duration}</b>
        )}
      </TextLabel>
      <TextLabel>
        Slash Validator Percentage <b>{proposalPunishValidator.portion}%</b>
      </TextLabel>
    </div>
  ) : null;
}
