import moment from "moment";
import { ValidatorPunishment } from "utils/dso";

import { TextLabel } from "../style";

interface ProposalPunishValidatorProps {
  readonly proposalPunishValidator: ValidatorPunishment | undefined;
}

export default function ProposalPunishValidator({
  proposalPunishValidator,
}: ProposalPunishValidatorProps): JSX.Element | null {
  let jailForever = false;
  if (!proposalPunishValidator?.jailing_duration) {
    jailForever = true;
  }
  return proposalPunishValidator ? (
    <div
      style={{ height: "125px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <TextLabel>
        Validator To be Punished: <b>{proposalPunishValidator.member}</b>
      </TextLabel>
      <TextLabel>
        Jail Validator until:{" "}
        {jailForever ? (
          <b style={{ color: "red" }}>Forever</b>
        ) : (
          <b>
            {/*           {" "}
            {proposalPunishValidator?.jailing_duration?.duration?
              ? moment.unix(proposalPunishValidator.jailing_duration?.duration).format("DD/MM/YYYY")
              : null} */}
          </b>
        )}
      </TextLabel>

      <TextLabel>
        Slash Validator Percentage of Funds: <b>{proposalPunishValidator.portion}%</b>
      </TextLabel>
      <TextLabel>Comment:</TextLabel>
    </div>
  ) : null;
}
