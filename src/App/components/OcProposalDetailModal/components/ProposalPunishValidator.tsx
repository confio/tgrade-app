import moment from "moment";
import { ValidatorPunishment } from "utils/trustedCircle";

import { TextLabel } from "../style";

interface ProposalPunishValidatorProps {
  readonly proposalPunishValidator: ValidatorPunishment | undefined;
}

const todayDate = Math.round(new Date().getTime() / 1000);
// dateOffset required due to inacuraccy in actual release time
const dateOffset = 43200;

export default function ProposalPunishValidator({
  proposalPunishValidator,
}: ProposalPunishValidatorProps): JSX.Element | null {
  if (!proposalPunishValidator) return null;
  const dateInSeconds = todayDate + (proposalPunishValidator?.jailing_duration as any).duration + dateOffset;

  return (
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
          <b>{moment.unix(dateInSeconds).local().format("DD/MM/YYYY")}</b>
        )}
      </TextLabel>
      <TextLabel>
        Slash Validator Percentage of Funds: <b>{proposalPunishValidator.portion}%</b>
      </TextLabel>
      <TextLabel>Comment:</TextLabel>
    </div>
  );
}
