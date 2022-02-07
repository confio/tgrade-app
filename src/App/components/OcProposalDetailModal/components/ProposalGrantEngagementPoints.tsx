import AddressTag from "App/components/AddressTag";
import { Engagement } from "utils/trustedCircle";

import { AddressField, TextLabel } from "../style";

interface ProposalGrantEngagementPointsProps {
  readonly proposalGrantEngagement: Engagement | undefined;
}

export default function ProposalGrantEngagementPoints({
  proposalGrantEngagement,
}: ProposalGrantEngagementPointsProps): JSX.Element | null {
  return proposalGrantEngagement ? (
    <AddressField>
      <TextLabel>Grant {proposalGrantEngagement.points} Engagement Points to:</TextLabel>
      <AddressTag address={proposalGrantEngagement.member} />
    </AddressField>
  ) : null;
}
