import { UpdateConsensusBlockParams } from "utils/validatorVoting";

import { ChangedField, TextLabel, TextValue } from "../style";

interface ProposalUpdateConsensusBlockParamsProps {
  readonly proposalUpdateConsensusBlockParams: UpdateConsensusBlockParams | undefined;
}

export default function ProposalUpdateConsensusBlockParams({
  proposalUpdateConsensusBlockParams,
}: ProposalUpdateConsensusBlockParamsProps): JSX.Element | null {
  return proposalUpdateConsensusBlockParams ? (
    <>
      {proposalUpdateConsensusBlockParams.max_bytes ? (
        <ChangedField>
          <TextLabel>Maximum bytes</TextLabel>
          <TextValue>{proposalUpdateConsensusBlockParams.max_bytes}</TextValue>
        </ChangedField>
      ) : null}
      {proposalUpdateConsensusBlockParams.max_gas ? (
        <ChangedField>
          <TextLabel>Maximum gas</TextLabel>
          <TextValue>{proposalUpdateConsensusBlockParams.max_gas}</TextValue>
        </ChangedField>
      ) : null}
    </>
  ) : null;
}
