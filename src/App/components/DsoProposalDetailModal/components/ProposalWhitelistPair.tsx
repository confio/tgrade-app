import AddressTag from "App/components/AddressTag";

import { AddressField, TextValue } from "../style";

interface ProposalWhitelistPairProps {
  readonly pairAddress?: string;
}

export default function ProposalWhitelistPair({
  pairAddress,
}: ProposalWhitelistPairProps): JSX.Element | null {
  return pairAddress?.length ? (
    <AddressField>
      <TextValue>Pair to be whitelisted:</TextValue>
      <AddressTag address={pairAddress} />
    </AddressField>
  ) : null;
}
