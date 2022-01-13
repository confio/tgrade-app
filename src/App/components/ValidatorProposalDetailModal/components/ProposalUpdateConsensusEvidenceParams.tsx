import { UpdateConsensusEvidenceParams } from "utils/validatorVoting";

import { ChangedField, TextLabel, TextValue } from "../style";

interface ProposalUpdateConsensusEvidenceParamsProps {
  readonly proposalUpdateConsensusEvidenceParams: UpdateConsensusEvidenceParams | undefined;
}

export default function ProposalUpdateConsensusEvidenceParams({
  proposalUpdateConsensusEvidenceParams,
}: ProposalUpdateConsensusEvidenceParamsProps): JSX.Element | null {
  return proposalUpdateConsensusEvidenceParams ? (
    <>
      {proposalUpdateConsensusEvidenceParams.max_age_num_blocks ? (
        <ChangedField>
          <TextLabel>Max age of evidence, in blocks</TextLabel>
          <TextValue>{proposalUpdateConsensusEvidenceParams.max_age_num_blocks}</TextValue>
        </ChangedField>
      ) : null}
      {proposalUpdateConsensusEvidenceParams.max_age_duration ? (
        <ChangedField>
          <TextLabel>Max age of evidence, in seconds</TextLabel>
          <TextValue>{proposalUpdateConsensusEvidenceParams.max_age_duration}</TextValue>
        </ChangedField>
      ) : null}
      {proposalUpdateConsensusEvidenceParams.max_bytes ? (
        <ChangedField>
          <TextLabel>Maximum bytes</TextLabel>
          <TextValue>{proposalUpdateConsensusEvidenceParams.max_bytes}</TextValue>
        </ChangedField>
      ) : null}
    </>
  ) : null;
}
