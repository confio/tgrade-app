import AddressList from "App/components/AddressList";

import { TextValue } from "../style";

interface ProposalPinCodesProps {
  readonly proposalPinCodes: readonly number[] | undefined;
}

export default function ProposalPinCodes({ proposalPinCodes }: ProposalPinCodesProps): JSX.Element | null {
  return proposalPinCodes ? (
    <>
      <TextValue>Code IDs to be pinned:</TextValue>
      <AddressList addresses={proposalPinCodes.map((code) => code.toString())} />
    </>
  ) : null;
}
