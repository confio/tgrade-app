import AddressTag from "App/components/AddressTag";
import { MigrateContract } from "utils/validatorVoting";

import { AddressField, TextLabel, TextValue } from "../style";

interface ProposalMigrateContractProps {
  readonly proposalMigrateContract: MigrateContract | undefined;
}

export default function ProposalMigrateContract({
  proposalMigrateContract,
}: ProposalMigrateContractProps): JSX.Element | null {
  return proposalMigrateContract ? (
    <>
      <AddressField>
        <TextLabel>Contract to migrate</TextLabel>
        <AddressTag address={proposalMigrateContract.contract} />
      </AddressField>
      <TextValue>Code ID to migrate to: {proposalMigrateContract.code_id}</TextValue>
      <TextValue>Migrate message:</TextValue>
      <pre style={{ display: "block" }}>
        {JSON.stringify(JSON.parse(proposalMigrateContract.migrate_msg), null, 2)}
      </pre>
    </>
  ) : null;
}
