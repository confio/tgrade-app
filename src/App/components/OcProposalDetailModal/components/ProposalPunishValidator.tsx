import moment from "moment";
import { ValidatorPunishment } from "utils/dso";

import { TextLabel } from "../style";

interface ProposalPunishValidatorProps {
  readonly proposalPunishValidator: ValidatorPunishment | undefined;
}

export default function ProposalPunishValidator({
  proposalPunishValidator,
}: ProposalPunishValidatorProps): JSX.Element | null {
  const dateInSeconds = Math.round(
    (proposalPunishValidator?.jailing_duration as any).duration + new Date().getTime(),
  );

  return proposalPunishValidator ? (
    <div
      style={{ height: "125px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
    >
      <TextLabel>
        Validator To be Punished: <b>{proposalPunishValidator.member}</b>
      </TextLabel>
      <TextLabel>
        Validator jailed until:{" "}
        {proposalPunishValidator.jailing_duration === "forever" ? (
          <b style={{ color: "red" }}>Forever</b>
        ) : (
          <b>{moment(dateInSeconds).format("DD/MM/YYYY")}</b>
        )}
      </TextLabel>
      <TextLabel>
        Slash Validator Percentage of Funds: <b>{proposalPunishValidator.portion}%</b>
      </TextLabel>
      <TextLabel>Comment:</TextLabel>
    </div>
  ) : null;
}
