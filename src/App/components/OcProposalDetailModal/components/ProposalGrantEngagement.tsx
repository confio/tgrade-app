import AddressTag from "App/components/AddressTag";
import { Engagement } from "utils/dso";

import { AddressField, TextLabel } from "../style";

interface ProposalGrantEngagementProps {
  readonly proposalGrantEngagement: Engagement | undefined;
}

export default function ProposalGrantEngagement({
  proposalGrantEngagement,
}: ProposalGrantEngagementProps): JSX.Element | null {
  return proposalGrantEngagement ? (
    <AddressField>
      <TextLabel>Grant {proposalGrantEngagement.points} Engagement Points to:</TextLabel>
      <AddressTag address={proposalGrantEngagement.member} />
    </AddressField>
  ) : null;
}
