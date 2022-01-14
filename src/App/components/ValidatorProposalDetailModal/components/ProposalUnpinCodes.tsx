import AddressList from "App/components/AddressList";

import { TextValue } from "../style";

interface ProposalUnpinCodesProps {
  readonly proposalUnpinCodes: readonly number[] | undefined;
}

export default function ProposalUnpinCodes({
  proposalUnpinCodes,
}: ProposalUnpinCodesProps): JSX.Element | null {
  return proposalUnpinCodes ? (
    <>
      <TextValue>Code IDs to be unpinned:</TextValue>
      <AddressList addresses={proposalUnpinCodes.map((code) => code.toString())} />
    </>
  ) : null;
}
