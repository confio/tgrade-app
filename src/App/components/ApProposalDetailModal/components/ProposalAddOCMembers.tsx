import AddressList from "App/components/AddressList";

import { TextValue } from "../style";

interface ProposalAddOCMembersProps {
  readonly proposalAddVotingMembers: readonly string[] | undefined;
}

export default function ProposalAddOCMembers({
  proposalAddVotingMembers,
}: ProposalAddOCMembersProps): JSX.Element | null {
  return proposalAddVotingMembers?.length ? (
    <>
      <TextValue>Members to be added:</TextValue>
      <AddressList addresses={proposalAddVotingMembers} short copyable />
    </>
  ) : null;
}
