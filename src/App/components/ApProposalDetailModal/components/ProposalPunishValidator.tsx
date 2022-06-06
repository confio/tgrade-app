import AddressTag from "App/components/AddressTag";
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

  const dateInSeconds = proposalPunishValidator.jailing_duration?.duration
    ? todayDate + proposalPunishValidator.jailing_duration.duration + dateOffset
    : 0;

  return (
    <>
      <TextLabel>
        Validator To be Punished: <AddressTag address={proposalPunishValidator.member} />
      </TextLabel>
      {proposalPunishValidator.jailing_duration?.forever ? (
        <TextLabel>
          <b style={{ color: "var(--color-error-alert)" }}>Validator will be jailed forever</b>
        </TextLabel>
      ) : null}
      {proposalPunishValidator.jailing_duration?.duration &&
      proposalPunishValidator.jailing_duration.duration !== 0 ? (
        <TextLabel>
          Validator will be jailed until:{" "}
          <b style={{ color: "var(--color-error-alert)" }}>
            {moment.unix(dateInSeconds).local().format("DD/MM/YYYY")}
          </b>
        </TextLabel>
      ) : null}
      {proposalPunishValidator.portion && proposalPunishValidator.portion !== "0" ? (
        <TextLabel>
          Percentage to slash of funds and Distributed Points:{" "}
          <b>{parseFloat(proposalPunishValidator.portion) * 100}%</b>
        </TextLabel>
      ) : null}
    </>
  );
}
