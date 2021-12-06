import AddressList from "App/components/AddressList";

import { TextValue } from "../style";

interface ProposalVotingMembersProps {
  readonly proposalAddVotingMembers: readonly string[] | undefined;
}

export default function ProposalAddVotingMembers({
  proposalAddVotingMembers,
}: ProposalVotingMembersProps): JSX.Element | null {
  return proposalAddVotingMembers?.length ? (
    <>
      <TextValue>Voting members to be added:</TextValue>
      <AddressList addresses={proposalAddVotingMembers} short copyable />
    </>
  ) : null;
}
