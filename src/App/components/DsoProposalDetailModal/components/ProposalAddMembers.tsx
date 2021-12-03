import AddressList from "App/components/AddressList";

import { TextValue } from "../style";

interface ProposalAddMembersProps {
  readonly proposalAddMembers: readonly string[] | undefined;
}

export default function ProposalAddMembers({
  proposalAddMembers,
}: ProposalAddMembersProps): JSX.Element | null {
  return proposalAddMembers?.length ? (
    <>
      <TextValue>Members to be added:</TextValue>
      <AddressList addresses={proposalAddMembers} short copyable />
    </>
  ) : null;
}
