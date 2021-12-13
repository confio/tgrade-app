import AddressList from "App/components/AddressList";

import { TextValue } from "../style";

interface ProposalRemoveMembersProps {
  readonly proposalRemoveMembers: readonly string[] | undefined;
}

export default function ProposalRemoveMembers({
  proposalRemoveMembers,
}: ProposalRemoveMembersProps): JSX.Element | null {
  return proposalRemoveMembers?.length ? (
    <>
      <TextValue>Members to be removed:</TextValue>
      <AddressList addresses={proposalRemoveMembers} short copyable />
    </>
  ) : null;
}
