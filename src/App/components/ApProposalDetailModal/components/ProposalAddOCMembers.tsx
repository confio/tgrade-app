import AddressList from "App/components/AddressList";
import { AssignedArbiters } from "utils/arbiterPool";

import { TextValue } from "../style";

interface ProposalProposeArbitersProps {
  readonly proposalProposeArbiters: AssignedArbiters | undefined;
}

export default function ProposalProposeArbiters({
  proposalProposeArbiters,
}: ProposalProposeArbitersProps): JSX.Element | null {
  return proposalProposeArbiters ? (
    <>
      <TextValue>Complaint to be arbited (ID): {proposalProposeArbiters.case_id}</TextValue>
      <TextValue>Arbiters to be proposed:</TextValue>
      <AddressList addresses={proposalProposeArbiters.arbiters} short copyable />
    </>
  ) : null;
}
