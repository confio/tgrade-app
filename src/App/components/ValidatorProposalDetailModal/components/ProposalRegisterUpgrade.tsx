import { RegisterUpgrade } from "utils/validatorVoting";

import { TextValue } from "../style";

interface ProposalRegisterUpgradeProps {
  readonly proposalRegisterUpgrade: RegisterUpgrade | undefined;
}

export default function ProposalRegisterUpgrade({
  proposalRegisterUpgrade,
}: ProposalRegisterUpgradeProps): JSX.Element | null {
  return proposalRegisterUpgrade ? (
    <>
      <TextValue>Name: {proposalRegisterUpgrade.name}</TextValue>
      <TextValue>Upgrade at height: {proposalRegisterUpgrade.height}</TextValue>
      <TextValue>Upgrade info {proposalRegisterUpgrade.info}</TextValue>
    </>
  ) : null;
}
