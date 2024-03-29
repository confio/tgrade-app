import { fromBase64, fromUtf8 } from "@cosmjs/encoding";
import AddressTag from "App/components/AddressTag";
import { useEffect, useState } from "react";
import { MigrateContract } from "utils/validatorVoting";

import { AddressField, TextLabel, TextValue } from "../style";

interface ProposalMigrateContractProps {
  readonly proposalMigrateContract: MigrateContract | undefined;
}

export default function ProposalMigrateContract({
  proposalMigrateContract,
}: ProposalMigrateContractProps): JSX.Element | null {
  const [migrateMsgString, setMigrateMsgString] = useState("{}");

  useEffect(() => {
    if (!proposalMigrateContract?.migrate_msg) return;
    try {
      const migrateMsgJsonString = fromUtf8(fromBase64(proposalMigrateContract.migrate_msg));

      try {
        const migrateMsgString = JSON.stringify(JSON.parse(migrateMsgJsonString), null, 2);
        setMigrateMsgString(migrateMsgString);
      } catch {
        setMigrateMsgString(migrateMsgJsonString);
      }
    } catch {
      setMigrateMsgString(proposalMigrateContract.migrate_msg);
    }
  }, [proposalMigrateContract?.migrate_msg]);

  return proposalMigrateContract ? (
    <>
      <AddressField>
        <TextLabel>Contract to migrate</TextLabel>
        <AddressTag address={proposalMigrateContract.contract} />
      </AddressField>
      <TextValue>Code ID to migrate to: {proposalMigrateContract.code_id}</TextValue>
      <TextValue>Migrate message:</TextValue>
      <pre style={{ display: "block" }}>{migrateMsgString}</pre>
    </>
  ) : null;
}
